import { business, copy, menuItems, menuNote, sections } from '../config/business.js'
import { ExternalLink, Icon, Kicker } from './ui.jsx'

const yen = (n) => `¥${n.toLocaleString('ja-JP')}`

export default function Menu() {
  const section = sections.menu
  return (
    <section id={section.id} className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="menu__card">
          <div className="menu__head">
            <Kicker section={section} />
            <h2 id="menu-title" className="section-title">
              {copy.menu.title}
            </h2>
            <p className="lead">{copy.menu.lead}</p>
          </div>

          <ol className="menu__list">
            {menuItems.map((item, i) => (
              <li key={item.name} className="menu-item">
                <span className="menu-item__no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="menu-item__name">
                  {item.name}
                  <span className="menu-item__detail">{item.detail}</span>
                </h3>
                <div className="menu-item__side">
                  <span className="menu-item__target">
                    <span className="sr-only">対象：</span>
                    {item.target}
                  </span>
                  <p className="menu-item__price">
                    {yen(item.price)}
                    <small>税込</small>
                  </p>
                </div>
                <ul className="menu-item__conditions" aria-label="条件">
                  {item.conditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="menu__notes">
            <p>※{menuNote}</p>
            <p>※{copy.menu.lateFeeNote}</p>
          </div>

          <div className="menu__cta">
            <ExternalLink href={business.links.menu} className="btn btn--primary">
              {copy.menu.moreCta}
              <Icon name="external" />
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  )
}
