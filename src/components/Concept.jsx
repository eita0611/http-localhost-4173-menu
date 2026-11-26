import { copy, images, sections } from '../config/business.js'
import { Kicker, ResponsiveImage } from './ui.jsx'

export default function Concept() {
  const section = sections.concept
  return (
    <section id={section.id} className="section concept" aria-labelledby="concept-title">
      <div className="container concept__grid">
        <figure className="concept__media">
          <ResponsiveImage
            name={images.concept.file}
            alt={images.concept.alt}
            sizes="(min-width: 768px) 40vw, 100vw"
            style={{ objectPosition: images.concept.position }}
          />
          {images.concept.isSample && <figcaption className="concept__caption">イメージ写真</figcaption>}
        </figure>
        <div className="concept__body">
          <Kicker section={section} />
          <h2 id="concept-title" className="concept__title pre-line">
            {copy.concept.title}
          </h2>
          <div className="concept__text">
            {copy.concept.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
