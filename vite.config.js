import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { business, fullAddress, images, site, theme } from './src/config/business.js'
import manifest from './src/config/image-manifest.json' with { type: 'json' }

// 公開モード
//   demo       … 営業提案用（既定）。noindex、構造化データなし、デモ表示あり
//   production … 店舗オーナーの承認後に使用。npm run build:production で有効化
const resolveSiteMode = (mode, env) =>
  mode === 'production-site' || env.VITE_SITE_MODE === 'production' ? 'production' : 'demo'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const srcSet = (name) =>
  manifest[name].widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')

// 正式ドメインは business.js の site.productionUrl、または環境変数 VITE_PRODUCTION_URL で指定
function sitePlugin(siteMode, env) {
  const isProd = siteMode === 'production'
  const baseUrl = (env.VITE_PRODUCTION_URL || site.productionUrl).replace(/\/$/, '')

  return {
    name: 'leciel-site',
    buildStart() {
      if (!isProd) return
      if (!baseUrl) {
        this.error('正式公開モードには src/config/business.js の site.productionUrl（店舗の正式ドメイン）が必要です。')
      }
      const vercelPath = path.resolve(import.meta.dirname, 'vercel.json')
      if (existsSync(vercelPath) && /X-Robots-Tag/i.test(readFileSync(vercelPath, 'utf8'))) {
        this.error('vercel.json に X-Robots-Tag（noindex）が残っています。正式公開前に削除してください（README 参照）。')
      }
    },
    transformIndexHtml(html) {
      const colors = Object.entries(theme.colors).map(([k, v]) => `--color-${k}:${v}`).join(';')
      const fonts = `--font-display:${theme.fonts.display};--font-serif-ja:${theme.fonts.serifJa};--font-sans:${theme.fonts.sans}`
      const title = isProd ? site.title.production : site.title.demo

      const head = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(site.description)}" />`,
        `<meta name="theme-color" content="${theme.colors.bg}" />`,
        isProd
          ? `<meta name="robots" content="index,follow" />`
          : `<meta name="robots" content="noindex,nofollow" />`,
        `<style>:root{${colors};${fonts}}</style>`,
        `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
        `<link rel="stylesheet" href="${theme.fonts.googleFontsUrl}" media="print" onload="this.media='all'" />`,
        `<noscript><link rel="stylesheet" href="${theme.fonts.googleFontsUrl}" /></noscript>`,
        `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcSet(images.hero.file)}" imagesizes="${images.hero.sizes}" fetchpriority="high" />`,
      ]

      if (isProd) {
        const ogImage = `${baseUrl}/images/og-image.jpg`
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'NailSalon',
          name: business.name,
          alternateName: [business.shortName, business.kana],
          url: `${baseUrl}/`,
          telephone: business.phone,
          image: ogImage,
          address: {
            '@type': 'PostalAddress',
            postalCode: business.address.postalCode,
            addressRegion: business.address.region,
            addressLocality: business.address.locality,
            streetAddress: `${business.address.street} ${business.address.building}`,
            addressCountry: 'JP',
          },
        }
        head.push(
          `<link rel="canonical" href="${baseUrl}/" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:locale" content="ja_JP" />`,
          `<meta property="og:site_name" content="${esc(business.name)}" />`,
          `<meta property="og:title" content="${esc(title)}" />`,
          `<meta property="og:description" content="${esc(site.description)}" />`,
          `<meta property="og:url" content="${baseUrl}/" />`,
          `<meta property="og:image" content="${ogImage}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
        )
      }

      return html.replace('<!--site-head-->', head.join('\n    '))
    },
    generateBundle() {
      const robots = isProd
        ? `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (isProd) {
        const today = new Date().toISOString().slice(0, 10)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
        })
      }
      console.log(`\n[site] ${isProd ? '正式公開モード' : 'デモモード（noindex）'}でビルドしました。住所: ${fullAddress()}`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteMode = resolveSiteMode(mode, env)
  return {
    plugins: [react(), sitePlugin(siteMode, env)],
    define: { __SITE_MODE__: JSON.stringify(siteMode) },
  }
})
