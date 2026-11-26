import { business, copy, mapsLinks, sections, telHref } from '../config/business.js'
import { ExternalLink, Icon, Kicker } from './ui.jsx'

export default function Access() {
  const section = sections.access
  const { hours, address: a } = business
  const rows = [
    { label: '店舗名', value: business.name },
    {
      label: '住所',
      value: (
        <>
          <span className="nowrap">〒{a.postalCode}</span>{' '}
          <span className="nowrap">
            {a.region}
            {a.locality}
            {a.street}
          </span>{' '}
          <span className="nowrap">{a.building}</span>
        </>
      ),
    },
    {
      label: '電話番号',
      value: (
        <a className="info__tel" href={telHref}>
          {business.phone}
        </a>
      ),
    },
    { label: 'アクセス', value: `${business.station.name}から${business.station.walk}` },
    {
      label: '営業時間',
      value: (
        <>
          {hours.listed}
          <small>
            {hours.listedSource}。{hours.lateFee}。{hours.notice}
          </small>
        </>
      ),
    },
    { label: '定休日', value: business.closed },
    { label: '設備', value: business.rooms.label },
    { label: 'お支払い', value: business.payment },
    { label: '駐車場', value: business.parking },
  ]

  return (
    <section id={section.id} className="section access" aria-labelledby="access-title">
      <div className="container access__grid">
        <div className="access__intro">
          <Kicker section={section} />
          <h2 id="access-title" className="section-title">
            {copy.access.title}
          </h2>
          <ol className="route" aria-label="駅からの道のり">
            {copy.access.route.map((step) => (
              <li key={step.label}>
                <span className="route__label">{step.label}</span>
                {step.note && <span className="route__note">{step.note}</span>}
              </li>
            ))}
          </ol>
        </div>

        <div className="access__detail">
          <dl className="info">
            {rows.map((row) => (
              <div key={row.label} className="info__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="access__actions">
            <ExternalLink href={mapsLinks.directions} className="btn btn--primary">
              Googleマップで経路を確認
              <Icon name="external" />
            </ExternalLink>
            <a href={telHref} className="btn btn--outline">
              <Icon name="phone" />
              電話をかける
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
