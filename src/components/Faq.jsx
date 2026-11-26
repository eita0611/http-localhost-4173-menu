import { copy, sections } from '../config/business.js'
import { Kicker } from './ui.jsx'

export default function Faq() {
  const section = sections.faq
  return (
    <section id={section.id} className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div>
          <Kicker section={section} />
          <h2 id="faq-title" className="section-title">
            {copy.faq.title}
          </h2>
        </div>
        <div className="faq__list">
          {copy.faq.items.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>{item.q}</summary>
              <p className="faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
