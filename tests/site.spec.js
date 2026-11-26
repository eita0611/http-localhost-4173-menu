import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { business, galleryItems, mapsLinks } from '../src/config/business.js'

const WIDTHS = [375, 390, 768, 1024, 1440]

async function open(page, width) {
  await page.setViewportSize({ width, height: width < 800 ? 812 : 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
}

test.describe('デモモードの公開制御', () => {
  test('noindex が設定され、構造化データ・canonical が出力されていない', async ({ page, request }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow')
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await expect(page.locator('.demo-bar')).toContainText('非公式デモ')
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Disallow: /')
  })
})

for (const width of WIDTHS) {
  test(`${width}px: 横スクロール・画像切れ・コンソールエラーがない`, async ({ page }) => {
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    await open(page, width)

    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 500) {
      await page.evaluate((y) => window.scrollTo(0, y), y)
      await page.waitForTimeout(80)
    }
    // 遅延読み込みの画像がすべて読み込み終わるまで待つ
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15_000 })

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)

    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    )
    expect(broken).toEqual([])
    expect(errors).toEqual([])
  })
}

test('ファーストビューの画像は遅延読み込みせず、その他は遅延読み込み', async ({ page }) => {
  await open(page, 1440)
  await expect(page.locator('.hero img')).toHaveAttribute('loading', 'eager')
  const lazy = await page.locator('main img:not(.hero img)').evaluateAll((imgs) => imgs.map((i) => i.loading))
  expect(lazy.length).toBeGreaterThan(5)
  expect(lazy.every((l) => l === 'lazy')).toBe(true)
  const missingAlt = await page.locator('img').evaluateAll((imgs) => imgs.filter((i) => !i.alt).length)
  expect(missingAlt).toBe(0)
})

test('予約・電話・地図のリンク先が正しい', async ({ page }) => {
  await open(page, 1440)
  const reserve = page.getByRole('link', { name: /空席確認・Web予約/ })
  expect(await reserve.count()).toBeGreaterThanOrEqual(2)
  for (const href of await reserve.evaluateAll((els) => els.map((e) => e.href))) {
    expect(href).toBe(business.links.reserve)
  }
  await expect(page.getByRole('link', { name: /すべてのメニュー・最新料金を見る/ })).toHaveAttribute('href', business.links.menu)
  await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute('href', 'tel:0362569291')

  const maps = page.getByRole('link', { name: /Googleマップで経路を確認/ })
  await expect(maps).toHaveAttribute('href', mapsLinks.directions)
  const url = new URL(mapsLinks.directions)
  expect(url.hostname).toBe('www.google.com')
  expect(url.searchParams.get('api')).toBe('1')
  expect(url.searchParams.get('destination')).toContain('神田三崎町2-11-12')
  expect(url.searchParams.get('destination')).not.toMatch(/\d+\.\d{4,}/) // 緯度・経度を含まない

  // 外部リンクは新しいタブ + noopener
  const unsafe = await page
    .locator('a[target="_blank"]')
    .evaluateAll((els) => els.filter((e) => !e.rel.includes('noopener')).length)
  expect(unsafe).toBe(0)
})

test('ギャラリーのカテゴリーフィルターが機能する', async ({ page }) => {
  await open(page, 1440)
  const shots = page.locator('#design figure.shot')
  await expect(shots).toHaveCount(galleryItems.length)

  for (const [label, category] of [
    ['Magnet', 'magnet'],
    ['Korean', 'korean'],
    ['Foot', 'foot'],
    ['Simple', 'simple'],
  ]) {
    const button = page.locator('.filter', { hasText: label })
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(shots).toHaveCount(galleryItems.filter((i) => i.category === category).length)
  }
  await page.locator('.filter', { hasText: 'All' }).click()
  await expect(shots).toHaveCount(galleryItems.length)

  // キーボードでも操作できる
  await page.locator('.filter', { hasText: 'Art' }).focus()
  await page.keyboard.press('Enter')
  await expect(shots).toHaveCount(galleryItems.filter((i) => i.category === 'art').length)
})

test.describe('モバイル', () => {
  test('メニューが開閉し、Escで閉じてフォーカスが戻る', async ({ page }) => {
    await open(page, 375)
    const toggle = page.locator('.menu-toggle')
    const panel = page.locator('#mobile-nav')
    await expect(panel).toBeHidden()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(panel).toBeVisible()
    await expect(page.locator('#mobile-nav a').first()).toBeFocused()
    expect(await page.locator('#main').evaluate((el) => el.inert)).toBe(true)

    // パネルがヘッダーと重ならず、閉じるボタンを押せる
    const headerBottom0 = await page.locator('.header').evaluate((el) => el.getBoundingClientRect().bottom)
    const panelTop = await panel.evaluate((el) => el.getBoundingClientRect().top)
    expect(panelTop).toBeGreaterThanOrEqual(headerBottom0 - 1)
    await toggle.click()
    await expect(panel).toBeHidden()

    await toggle.click()
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    await expect(toggle).toBeFocused()
    expect(await page.locator('#main').evaluate((el) => el.inert)).toBe(false)

    // リンクで移動するとメニューが閉じ、見出しがヘッダーに隠れない
    await toggle.click()
    await page.locator('#mobile-nav a', { hasText: 'Menu' }).click()
    await expect(panel).toBeHidden()
    await page.waitForTimeout(400)
    const headerBottom = await page.locator('.header').evaluate((el) => el.getBoundingClientRect().bottom)
    const sectionTop = await page.locator('#menu').evaluate((el) => el.getBoundingClientRect().top)
    expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 1)
  })

  test('下部固定の予約ボタンがフッターの文字を隠さない', async ({ page }) => {
    await open(page, 390)
    const bar = page.locator('.mobile-cta')
    await expect(bar).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(300)
    const barTop = await bar.evaluate((el) => el.getBoundingClientRect().top)
    const lastText = await page.locator('.footer__legal > :last-child').evaluate((el) => el.getBoundingClientRect().bottom)
    expect(lastText).toBeLessThanOrEqual(barTop)
  })

  test('デスクトップ幅では下部固定ボタンを表示しない', async ({ page }) => {
    await open(page, 1440)
    await expect(page.locator('.mobile-cta')).toBeHidden()
    await expect(page.locator('.header__reserve')).toBeVisible()
  })
})

test('ページ内リンクでヘッダーに見出しが隠れない（デスクトップ）', async ({ page }) => {
  await open(page, 1440)
  await page.locator('.nav__link', { hasText: 'Access' }).click()
  await page.waitForTimeout(400)
  const headerBottom = await page.locator('.header').evaluate((el) => el.getBoundingClientRect().bottom)
  const top = await page.locator('#access').evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(headerBottom - 1)
})

test('見出し構造: h1 は1つ、h2 が各セクションにある', async ({ page }) => {
  await open(page, 1440)
  await expect(page.locator('h1')).toHaveCount(1)
  expect(await page.locator('h2').count()).toBeGreaterThanOrEqual(8)
})

for (const width of [390, 1440]) {
  test(`${width}px: axe による WCAG 2.2 AA の自動チェック`, async ({ page }) => {
    await open(page, width)
    // 開閉式の Q&A も検査対象にする
    await page.locator('details').evaluateAll((els) => els.forEach((d) => (d.open = true)))
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
    expect(summary).toEqual([])
  })
}
