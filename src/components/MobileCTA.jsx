import { business, copy, telHref } from '../config/business.js'
import { ExternalLink, Icon } from './ui.jsx'

export default function MobileCTA() {
  return (
    <div className="mobile-cta" data-inert-when-menu>
      <ExternalLink href={business.links.reserve} className="btn btn--primary">
        {copy.hero.primaryCta}
      </ExternalLink>
      <a href={telHref} className="btn btn--outline mobile-cta__tel">
        <Icon name="phone" />
        電話
      </a>
    </div>
  )
}
