import manifest from '../config/image-manifest.json'

// assets-src/ から書き出した WebP を、画面幅に合わせて読み込みます。
export function ResponsiveImage({ name, alt, sizes, priority = false, className, style }) {
  const entry = manifest[name]
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`画像が見つかりません: ${name}（npm run images を実行してください）`)
    return null
  }
  const fallback = entry.widths.find((w) => w >= 960) ?? entry.widths.at(-1)
  return (
    <img
      src={`/images/${name}-${fallback}.webp`}
      srcSet={entry.widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'auto' : 'async'}
      className={className}
      style={style}
    />
  )
}

export function Kicker({ section }) {
  return (
    <p className="kicker">
      <span className="kicker__no">No.{section.no}</span>
      <span>{section.en}</span>
    </p>
  )
}

export function ExternalLink({ href, className, children, ...rest }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  )
}

const paths = {
  arrow: 'M2 8h11M9 4l4 4-4 4',
  external: 'M6 3H3v10h10v-3M9 3h4v4M13 3 7 9',
  phone:
    'M5.2 2.5 3.4 3.1c-.6.2-1 .8-.9 1.5.6 4.3 4.6 8.3 8.9 8.9.7.1 1.3-.3 1.5-.9l.6-1.8-2.9-1.5-1.3 1.3c-1.6-.7-2.9-2-3.6-3.6l1.3-1.3z',
}

export function Icon({ name }) {
  return (
    <svg className="btn__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
