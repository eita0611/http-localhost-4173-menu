import { useEffect, useRef, useState } from 'react'
import { business, copy, fullAddress, navigation, telHref } from '../config/business.js'
import { ExternalLink, Icon } from './ui.jsx'

export function Wordmark({ as: Tag = 'a', ...props }) {
  const { main, sub } = business.wordmark
  // 「Le」と「Ciel」で書体の表情を変えた仮ワードマーク
  const lead = main.slice(0, 2)
  const rest = main.slice(2)
  return (
    <Tag className="wordmark" {...props}>
      <span className="wordmark__main" aria-hidden="true">
        {lead}
        <i>{rest}</i>
      </span>
      <span className="wordmark__sub" aria-hidden="true">
        {sub}
      </span>
      <span className="sr-only">{business.name}</span>
    </Tag>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const sentinelRef = useRef(null)

  // スクロール後にヘッダーへ背景を付ける
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // メニューを開いている間は、背面を操作できないようにする
  useEffect(() => {
    const background = document.querySelectorAll('[data-inert-when-menu]')
    background.forEach((el) => (el.inert = open))
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open && panelRef.current) {
      // 上部のデモ表示などでヘッダーの位置が変わっても、パネルをヘッダーの直下から始める
      const headerBottom = panelRef.current.closest('.header').getBoundingClientRect().bottom
      panelRef.current.style.top = `${headerBottom}px`
      panelRef.current.querySelector('a, button')?.focus()
    }

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    if (open) {
      document.addEventListener('keydown', onKey)
      window.addEventListener('resize', onResize)
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1, marginBottom: -1 }} />
      <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="container header__inner">
          <Wordmark href="#top" onClick={close} />

          <nav className="nav" aria-label="メインメニュー">
            <ul className="nav__list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a className="nav__link" href={item.href} lang="en">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <ExternalLink href={business.links.reserve} className="btn btn--primary header__reserve">
              Web予約
            </ExternalLink>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span lang="en">{open ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle__bars" aria-hidden="true" />
              <span className="sr-only">{open ? 'メニューを閉じる' : 'メニューを開く'}</span>
            </button>
          </div>
        </div>

        <div id="mobile-nav" ref={panelRef} className="mobile-nav" hidden={!open}>
          <nav aria-label="メインメニュー（モバイル）">
            <ul className="mobile-nav__list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a className="mobile-nav__link" href={item.href} onClick={close}>
                    <span className="mobile-nav__en" lang="en">
                      {item.label}
                    </span>
                    <span className="mobile-nav__ja">{item.ja}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-nav__actions">
            <ExternalLink href={business.links.reserve} className="btn btn--primary">
              {copy.hero.primaryCta}
              <Icon name="external" />
            </ExternalLink>
            <a href={telHref} className="btn btn--outline">
              <Icon name="phone" />
              電話する {business.phone}
            </a>
          </div>
          <p className="mobile-nav__info">
            {fullAddress()}
            <br />
            {business.station.name} {business.station.walk}
          </p>
        </div>
      </header>
    </>
  )
}
