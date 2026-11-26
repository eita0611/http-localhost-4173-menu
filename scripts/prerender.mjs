// ビルド後に、ページの HTML をあらかじめ書き出します（表示速度と検索エンジン向け）。
// npm run build / npm run build:production の最後に自動で実行されます。
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const ssrDir = path.join(root, 'dist-ssr')
const indexPath = path.join(root, 'dist', 'index.html')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const html = await readFile(indexPath, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('dist/index.html に <div id="root"></div> が見つかりません')

await writeFile(indexPath, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(ssrDir, { recursive: true, force: true })
console.log('[prerender] dist/index.html に HTML を書き出しました')
