import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// ビルド版は書き出し済みの HTML を引き継ぎ、開発中は通常どおり描画します
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
