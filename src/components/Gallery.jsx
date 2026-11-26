import { useEffect, useMemo, useState } from 'react'
import { business, copy, galleryCategories, galleryItems, sections } from '../config/business.js'
import { ExternalLink, Icon, Kicker, ResponsiveImage } from './ui.jsx'

const WIDE = '(min-width: 1024px)'

// 書き出し済み HTML と一致させるため、初回は3列で描画し、表示後に画面幅へ合わせる
function useColumnCount() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide ? 3 : 2
}

const ALL = 'all'

export default function Gallery() {
  const section = sections.gallery
  const [active, setActive] = useState(ALL)
  const columnCount = useColumnCount()

  const visible = active === ALL ? galleryItems : galleryItems.filter((item) => item.category === active)
  // いちばん短い列へ順に積み、列の高さをそろえる
  const columns = useMemo(() => {
    const count = Math.min(columnCount, visible.length)
    const cols = Array.from({ length: count }, () => ({ items: [], height: 0 }))
    visible.forEach((item) => {
      const [w, h] = item.ratio.split('/').map(Number)
      const shortest = cols.reduce((a, b) => (b.height < a.height ? b : a))
      shortest.items.push(item)
      shortest.height += h / w
    })
    return cols.map((c) => c.items)
  }, [visible, columnCount])

  const filters = [
    { id: ALL, label: 'All', ja: 'すべて', count: galleryItems.length },
    ...galleryCategories.map((c) => ({ ...c, count: galleryItems.filter((i) => i.category === c.id).length })),
  ].filter((f) => f.count > 0)

  const categoryOf = (id) => galleryCategories.find((c) => c.id === id)
  const activeFilter = filters.find((f) => f.id === active)

  return (
    <section id={section.id} className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="gallery__head">
          <div>
            <Kicker section={section} />
            <h2 id="gallery-title" className="section-title">
              {copy.gallery.title}
            </h2>
          </div>
          <p className="lead">{copy.gallery.lead}</p>
        </div>

        <div className="filters" role="group" aria-label="デザインのカテゴリーで絞り込む">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="filter"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
            >
              <span lang="en">{f.label}</span>
              <span className="sr-only">（{f.ja}）</span>
              <span className="filter__count" aria-hidden="true">
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {activeFilter.ja}のデザインを{visible.length}件表示しています
        </p>

        <div className={`gallery__columns${columns.length === 1 ? ' is-single' : ''}`}>
          {columns.map((col, ci) => (
            <div className="gallery__col" key={ci}>
              {col.map((item) => (
                <figure className="shot" key={item.file}>
                  <div className="shot__frame" style={{ aspectRatio: item.ratio }}>
                    <ResponsiveImage
                      name={item.file}
                      alt={item.alt}
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 50vw"
                      style={{ objectPosition: item.position }}
                    />
                  </div>
                  <figcaption className="shot__caption">
                    <span className="shot__title">{item.title}</span>
                    <span className="shot__cat" lang="en">
                      {categoryOf(item.category)?.label}
                    </span>
                    {item.isSample !== false && <span className="shot__sample">イメージ写真</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>

        <div className="gallery__foot">
          <p className="gallery__note">{copy.gallery.sampleNote}</p>
          <ExternalLink href={business.links.photos} className="text-link">
            {copy.gallery.photosLinkLabel}
            <Icon name="external" />
          </ExternalLink>
        </div>
      </div>
    </section>
  )
}
