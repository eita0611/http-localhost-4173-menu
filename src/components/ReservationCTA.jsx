import { business, copy, telHref } from '../config/business.js'
import { ExternalLink, Icon } from './ui.jsx'

export default function ReservationCTA() {
  const { finalCta } = copy
  return (
    <section className="final-cta on-dark" aria-labelledby="final-cta-title">
      <div className="final-cta__arch" aria-hidden="true" />
      <div className="container final-cta__inner">
        <p className="final-cta__en" lang="en">
          Reservation
        </p>
        <h2 id="final-cta-title" className="final-cta__title">
          {finalCta.title}
        </h2>
        <p className="final-cta__lead">{finalCta.lead}</p>
        <div className="final-cta__actions">
          <ExternalLink href={business.links.reserve} className="btn btn--light">
            {finalCta.primaryCta}
            <Icon name="external" />
          </ExternalLink>
          <a href={telHref} className="btn btn--ghost-light">
            <Icon name="phone" />
            {finalCta.phoneLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
