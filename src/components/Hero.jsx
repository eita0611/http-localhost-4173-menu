import { business, copy, images, sections } from '../config/business.js'
import { ExternalLink, Icon, ResponsiveImage } from './ui.jsx'

export default function Hero() {
  const { hero } = copy
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__body">
          <p className="hero__eyebrow" lang="en">
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title pre-line">
            {hero.title}
          </h1>
          <p className="hero__lead">{hero.lead}</p>
          <ul className="hero__badges" aria-label="店舗の特徴">
            {hero.badges.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="hero__actions">
            <ExternalLink href={business.links.reserve} className="btn btn--primary">
              {hero.primaryCta}
              <Icon name="external" />
            </ExternalLink>
            <a href={`#${sections.gallery.id}`} className="text-link">
              {hero.secondaryCta}
              <Icon name="arrow" />
            </a>
          </div>
        </div>

        <figure className="hero__media">
          <div className="hero__frame">
            <ResponsiveImage
              name={images.hero.file}
              alt={images.hero.alt}
              sizes={images.hero.sizes}
              style={{ objectPosition: images.hero.position }}
              priority
            />
          </div>
          {images.hero.isSample && <figcaption className="hero__label">イメージ</figcaption>}
        </figure>
      </div>
    </section>
  )
}
