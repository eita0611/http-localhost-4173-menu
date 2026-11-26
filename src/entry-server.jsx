// ビルド時に HTML を書き出すための入口（scripts/prerender.mjs から使用）
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
