import { copy, images, sections } from '../config/business.js'
import { Kicker, ResponsiveImage } from './ui.jsx'

export default function Experience() {
  const section = sections.experience
  return (
    <section id={section.id} className="section experience" aria-labelledby="experience-title">
      <div className="container experience__grid">
        <div className="experience__body">
          <Kicker section={section} />
          <h2 id="experience-title" className="section-title">
            {copy.experience.title}
          </h2>
          <ol className="features">
            {copy.experience.features.map((f, i) => (
              <li key={f.title} className="feature">
                <span className="feature__no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="feature__title">{f.title}</h3>
                  <p className="feature__text">{f.text}</p>
                  <ul className="feature__points">
                    {f.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="experience__media">
          <ResponsiveImage
            name={images.experience.file}
            alt={images.experience.alt}
            sizes="(min-width: 1024px) 30vw, 100vw"
            style={{ objectPosition: images.experience.position }}
          />
          {images.experience.isSample && <figcaption className="experience__caption">イメージ写真</figcaption>}
        </figure>
      </div>
    </section>
  )
}
