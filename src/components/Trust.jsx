import { business, RESEARCH_DATE, ratings } from '../config/business.js'

export default function Trust() {
  const [hotpepper, google] = ['hotpepper', 'google'].map((id) => ratings.find((r) => r.id === id))
  const items = [
    { value: google.score, label: `Googleマップ評価（${google.count.toLocaleString()}件）` },
    { value: hotpepper.score, label: `ホットペッパービューティー評価（${hotpepper.count.toLocaleString()}件）` },
    { value: business.station.minutes, unit: '分', label: `${business.station.name}から徒歩` },
    { value: business.rooms.semiPrivate + business.rooms.private, unit: '室', label: business.rooms.label },
  ]
  return (
    <section className="trust" aria-label="店舗の基本情報と評価">
      <div className="container">
        <ul className="trust__list">
          {items.map((item) => (
            <li key={item.label} className="trust__item">
              <p className="trust__value">
                {item.value}
                {item.unit && <small>{item.unit}</small>}
              </p>
              <p className="trust__label">{item.label}</p>
            </li>
          ))}
        </ul>
        <p className="trust__note">
          出典：ホットペッパービューティー掲載情報（{RESEARCH_DATE}確認、直近1年の平均）／Googleマップ評価は{google.source}。2つの評価は別サービスの数値です。
        </p>
      </div>
    </section>
  )
}
