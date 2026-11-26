import { copy, ratings, sections } from '../config/business.js'
import { ExternalLink, Icon, Kicker } from './ui.jsx'

const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

function Stars({ value, max }) {
  const row = (fill, stroke) => (
    <svg viewBox="0 0 120 22" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => (
        <path key={i} d={STAR} transform={`translate(${i * 24} -1)`} fill={fill} stroke={stroke} strokeWidth="1" />
      ))}
    </svg>
  )
  return (
    <span className="stars" aria-hidden="true">
      {row('none', 'var(--color-accent)')}
      <span className="stars__fill" style={{ width: `${(Number(value) / max) * 100}%` }}>
        {row('var(--color-accent)', 'var(--color-accent)')}
      </span>
    </span>
  )
}

export default function Reviews() {
  const section = sections.reviews
  return (
    <section id={section.id} className="section reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews__head">
          <Kicker section={section} />
          <h2 id="reviews-title" className="section-title">
            {copy.reviews.title}
          </h2>
          <p className="lead">{copy.reviews.lead}</p>
        </div>

        <div className="scores">
          {ratings.map((r) => (
            <article key={r.id} className="score" aria-labelledby={`score-${r.id}`}>
              <h3 id={`score-${r.id}`} className="score__service">
                {r.service}
              </h3>
              <div className="score__main">
                <p>
                  <span className="score__value">{r.score}</span>
                  <span className="score__max"> / {r.max}</span>
                </p>
                <Stars value={r.score} max={r.max} />
              </div>
              <p className="score__count">口コミ {r.count.toLocaleString('ja-JP')}件</p>
              <p className="score__meta">
                {r.basis}
                <br />
                出典：{r.service}（{r.source}）
              </p>
              {r.details.length > 0 && (
                <dl className="score__details" aria-label="項目別の評価">
                  {r.details.map((d) => (
                    <div key={d.label}>
                      <dt>{d.label}</dt>
                      <dd>{d.score}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p>
                <ExternalLink href={r.link.href} className="text-link">
                  {r.link.label}
                  <Icon name="external" />
                </ExternalLink>
              </p>
            </article>
          ))}
        </div>
        <p className="reviews__note">{copy.reviews.textNote}</p>
      </div>
    </section>
  )
}
