import { defineConfig } from '@playwright/test'

// ブラウザは Mac にインストール済みの Google Chrome を使います（追加ダウンロード不要）
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
})
