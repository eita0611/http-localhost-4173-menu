import { business, fullAddress, photoCredit, site, telHref } from '../config/business.js'
import { Wordmark } from './Navbar.jsx'
import { ExternalLink } from './ui.jsx'

export default function Footer({ isDemo }) {
  return (
    <footer className="footer on-dark">
      <div className="container footer__inner">
        <div>
          <Wordmark href="#top" />
        </div>
        <div className="footer__info">
          <p>{business.name}</p>
          <p>{fullAddress()}</p>
          <p>
            TEL <a href={telHref}>{business.phone}</a>
          </p>
          <p>
            {business.station.name} {business.station.walk}／定休日 {business.closed}
          </p>
        </div>
        <nav className="footer__links" aria-label="外部リンク">
          <ExternalLink href={business.links.reserve}>Web予約（ホットペッパービューティー）</ExternalLink>
          <ExternalLink href={business.links.menu}>メニュー・料金</ExternalLink>
          <ExternalLink href={business.links.reviews}>口コミ</ExternalLink>
        </nav>
        <div className="footer__legal">
          {isDemo && <strong>{site.demoNotice}</strong>}
          {isDemo && <p>{site.wordmarkNotice}</p>}
          <p>{photoCredit}写真の出典はIMAGE_SOURCES.mdに記載しています。</p>
          {!isDemo && <p>© {business.shortName}</p>}
        </div>
      </div>
    </footer>
  )
}
