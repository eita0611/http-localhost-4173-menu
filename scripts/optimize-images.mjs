// assets-src/ に置いた元画像（JPG / PNG / WebP）から、表示用の WebP を複数サイズで書き出します。
// 使い方: npm run images
// 出力先: public/images/<名前>-<幅>.webp と src/config/image-manifest.json
import { readdir, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(root, 'assets-src')
const outDir = path.join(root, 'public', 'images')
const manifestPath = path.join(root, 'src', 'config', 'image-manifest.json')

const WIDTHS = [480, 960, 1440]
const QUALITY = 72

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
const manifest = {}

for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '')
  const input = sharp(path.join(srcDir, file)).rotate()
  const { width, height } = await input.metadata()
  const widths = WIDTHS.filter((w) => w < width).concat(width < WIDTHS.at(-1) ? [width] : [])
  const unique = [...new Set(widths.length ? widths : [width])]

  for (const w of unique) {
    await input
      .clone()
      .resize({ width: w })
      .webp({ quality: QUALITY })
      .toFile(path.join(outDir, `${name}-${w}.webp`))
  }
  manifest[name] = { width, height, widths: unique }
  console.log(`${name}: ${width}x${height} -> ${unique.join(', ')}`)
}

// SNS 共有用（正式公開モードの OGP で使用）
if (files.some((f) => f.startsWith('hero-'))) {
  const hero = files.find((f) => f.startsWith('hero-'))
  await sharp(path.join(srcDir, hero))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80 })
    .toFile(path.join(outDir, 'og-image.jpg'))
  console.log('og-image.jpg: 1200x630')
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${files.length} 枚を書き出しました → public/images/`)
