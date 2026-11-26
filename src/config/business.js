// ============================================================
// 店舗設定ファイル
// 店舗名・住所・メニュー・評価・写真・配色など、店舗固有の情報はすべてここに書きます。
// コンポーネント（src/components）には店舗固有の情報を書かないでください。
// 別の店舗に転用するときは、このファイルと assets-src/ の写真を差し替えます。
// ============================================================

// 調査基準日（評価・料金などを確認した日）
export const RESEARCH_DATE = '2026年11月26日'

const HOTPEPPER_TOP = 'https://beauty.hotpepper.jp/kr/slnH000363669/'

export const business = {
  name: 'ネイル＆リラクゼーションサロン LeCiel',
  shortName: 'LeCiel',
  kana: 'ルシエル',
  category: 'Nail & Relaxation Salon',
  // ヘッダー・フッターの仮ワードマーク（公式ロゴではありません）
  wordmark: { main: 'LeCiel', sub: 'Nail & Relaxation Salon' },

  address: {
    postalCode: '101-0061',
    region: '東京都',
    locality: '千代田区',
    street: '神田三崎町2-11-12',
    building: 'アイロン三崎町7階',
  },
  phone: '03-6256-9291',
  station: { name: 'JR水道橋駅', walk: '徒歩2分', minutes: 2 },
  areaLabel: '水道橋',

  hours: {
    // ホットペッパービューティー掲載情報。Googleマップでは閉店24:00の表示があり、相違があります。
    listed: '11:00〜翌1:00',
    listedSource: 'ホットペッパービューティー掲載情報',
    lateFee: '22時以降は深夜料金がかかります',
    notice: '掲載先によって営業時間の表記が異なるため、最新の営業時間・空席はWeb予約ページでご確認ください。',
    confirmed: false, // 店舗確認後に true にすると、正式公開時の構造化データへ反映できます
  },
  closed: '不定休',
  payment: 'Visa / Mastercard（店頭で利用可能なお支払い方法として掲載）',
  rooms: { semiPrivate: 2, private: 1, label: '半個室2室・完全個室1室' },
  parking: 'なし（近隣にコインパーキングあり）',

  links: {
    reserve: HOTPEPPER_TOP,
    menu: `${HOTPEPPER_TOP}coupon/`,
    reviews: `${HOTPEPPER_TOP}review/`,
    photos: `${HOTPEPPER_TOP}photo/`,
  },
}

export const fullAddress = (a = business.address) =>
  `〒${a.postalCode} ${a.region}${a.locality}${a.street} ${a.building}`

// Google マップの公式 URL 形式（Maps URLs）。緯度・経度は使わず、住所と店舗名を渡します。
const mapsQuery = `${business.address.region}${business.address.locality}${business.address.street} ${business.address.building} ${business.shortName}`
export const mapsLinks = {
  search: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`,
}

export const telHref = `tel:${business.phone.replace(/-/g, '')}`

// ------------------------------------------------------------
// 口コミ評価（2つのサービスは別々に表示し、合算しません）
// ------------------------------------------------------------
export const ratings = [
  {
    id: 'hotpepper',
    service: 'ホットペッパービューティー',
    score: '4.80',
    max: 5,
    count: 1915,
    basis: '直近1年間の口コミの平均点',
    source: `${RESEARCH_DATE}に掲載ページで確認`,
    // 依頼時資料では 1,902件。確認日に 1,915件へ増えていたため確認値を採用。
    details: [
      { label: '雰囲気', score: '4.7' },
      { label: '接客サービス', score: '4.8' },
      { label: '技術・仕上がり', score: '4.8' },
      { label: 'メニュー・料金', score: '4.7' },
    ],
    link: { label: 'ホットペッパービューティーで口コミを読む', href: business.links.reviews },
  },
  {
    id: 'google',
    service: 'Googleマップ',
    score: '4.8',
    max: 5,
    count: 25,
    basis: 'Googleマップ上の評価',
    source: '依頼者提供の情報（本デモ制作時は未検証）',
    details: [],
    link: { label: 'Googleマップで口コミを見る', href: mapsLinks.search },
  },
]

// ------------------------------------------------------------
// 参考メニュー（ホットペッパービューティーのクーポン掲載内容を要約）
// ------------------------------------------------------------
export const menuNote = `${RESEARCH_DATE}にホットペッパービューティーで確認した参考価格（税込）です。クーポンごとに提示条件・利用条件が異なり、内容は変更されている場合があります。`

export const menuItems = [
  {
    name: 'オフィス向けシンプルデザイン',
    detail: 'ワンカラー＋アート2本相当',
    price: 5300,
    target: '新規',
    conditions: ['ジェルオフ無料（スカルプのオフは別料金）', 'ドライケア込み'],
  },
  {
    name: 'シンプルネイル',
    detail: 'ワンカラー＋アート2本',
    price: 6100,
    target: '再来',
    conditions: ['2回目以降のご来店の方', 'オフは別料金', 'ドライケア込み'],
  },
  {
    name: '定額デザインネイル',
    detail: '30種類のデザインから選択',
    price: 7200,
    target: '新規・再来',
    conditions: ['新規・再来それぞれに同価格のクーポンあり', 'ファイリング・ドライケア込み', '持ち込みデザインは対象外'],
  },
  {
    name: 'マグネットネイル',
    detail: 'ワンカラー＋2〜4本アート',
    price: 7980,
    target: '全員',
    conditions: ['初回ジェルオフ無料', 'パラジェルへの変更は＋1,100円'],
  },
  {
    name: 'トレンドデザイン定額ネイル',
    detail: '50種類のデザインから選択',
    price: 8200,
    target: '新規',
    conditions: ['再来の方向けにも同価格のクーポンあり', 'パラジェルへの変更無料', '持ち込みデザインは追加料金の場合あり'],
  },
]

// ------------------------------------------------------------
// 写真（ファイル名は assets-src/ の元画像名。npm run images で書き出し）
// isSample: true は店舗の施術写真ではないイメージ素材
// ギャラリーの ratio は表示する縦横比、position は切り抜きの中心（左右% 上下%）
// ------------------------------------------------------------
export const images = {
  hero: {
    file: 'hero-nude-beige',
    alt: 'ベージュのワンカラーに整えた指先のイメージ写真',
    position: '50% 62%',
    sizes: '(min-width: 1024px) 44vw, 100vw', // index.html の先読み設定にも使用
    isSample: true,
  },
  concept: {
    file: 'concept-beige-hand',
    alt: '淡いベージュのネイルと細いリングをつけた手のイメージ写真',
    position: '40% 50%',
    isSample: true,
  },
  experience: {
    file: 'experience-nude-hands',
    alt: 'ヌードカラーのネイルを重ねた両手のイメージ写真',
    position: '40% 50%',
    isSample: true,
  },
}

export const galleryCategories = [
  { id: 'simple', label: 'Simple / Office', ja: 'シンプル・オフィス' },
  { id: 'magnet', label: 'Magnet', ja: 'マグネット' },
  { id: 'trend', label: 'Trend', ja: 'トレンド' },
  { id: 'korean', label: 'Korean / ワンホン', ja: '韓国・ワンホン' },
  { id: 'art', label: 'Art', ja: 'アート' },
  { id: 'foot', label: 'Foot', ja: 'フット' },
]

export const galleryItems = [
  { file: 'simple-french', ratio: '4 / 5', position: '50% 55%', category: 'simple', title: 'フレンチ', alt: '白いラインのフレンチネイルの手と小さな花のイメージ写真' },
  { file: 'trend-tortoiseshell', ratio: '3 / 4', position: '50% 60%', category: 'trend', title: 'べっ甲×ブラック', alt: 'ブラックとべっ甲柄を組み合わせたネイルのイメージ写真' },
  { file: 'korean-shell-parts', ratio: '4 / 5', position: '50% 55%', category: 'korean', title: 'シェル×ゴールドパーツ', alt: 'ピンクのシェル風ネイルにゴールドのパーツを添えたイメージ写真' },
  { file: 'magnet-grey-cateye', ratio: '4 / 3', position: '50% 50%', category: 'magnet', title: 'グレーのマグネット', alt: 'グレーのマグネットネイルにストーンを添えた両手のイメージ写真' },
  { file: 'art-navy-gold', ratio: '4 / 5', position: '50% 45%', category: 'art', title: 'ネイビー×ゴールド', alt: 'ネイビーとゴールド、白のニュアンスアートのネイルのイメージ写真' },
  { file: 'simple-greige-glitter', ratio: '1 / 1', position: '50% 50%', category: 'simple', title: 'グレージュ×ラメ', alt: 'グレージュと白、ラメを組み合わせたネイルのイメージ写真' },
  { file: 'korean-chrome-3d', ratio: '4 / 5', position: '50% 50%', category: 'korean', title: 'ミラー×立体アート', alt: 'ミラーネイルと立体的なラインアートのイメージ写真' },
  { file: 'trend-mirror-chrome', ratio: '3 / 4', position: '50% 45%', category: 'trend', title: 'ミラーネイル', alt: 'つややかなミラー仕上げのネイルのイメージ写真' },
  { file: 'korean-gradient', ratio: '4 / 5', position: '50% 45%', category: 'korean', title: 'グラデーション', alt: '先端に向かって白くなるグラデーションネイルのイメージ写真' },
  { file: 'art-mixed-nuance', ratio: '4 / 3', position: '50% 50%', category: 'art', title: 'ミックスアート', alt: '指ごとに異なる柄を描いたアートネイルのイメージ写真' },
  { file: 'foot-navy', ratio: '1 / 1', position: '50% 35%', category: 'foot', title: 'フットネイル', alt: 'ネイビーのフットネイルのイメージ写真' },
]

// 写真の出典表示（詳しくは IMAGE_SOURCES.md）
export const photoCredit = '掲載写真はUnsplashのイメージ素材です。LeCielの施術写真・店内写真ではありません。'

// ------------------------------------------------------------
// ページ構成（見出し番号・英字ラベル・ナビゲーション）
// ------------------------------------------------------------
export const sections = {
  concept: { id: 'concept', no: '01', en: 'Concept', ja: 'コンセプト' },
  gallery: { id: 'design', no: '02', en: 'Nail Design', ja: 'デザイン' },
  menu: { id: 'menu', no: '03', en: 'Menu & Price', ja: 'メニュー・料金' },
  experience: { id: 'experience', no: '04', en: 'Salon Experience', ja: 'サロンの特徴' },
  reviews: { id: 'reviews', no: '05', en: 'Reviews', ja: '口コミ評価' },
  access: { id: 'access', no: '06', en: 'Access', ja: 'アクセス' },
  faq: { id: 'faq', no: '07', en: 'Q & A', ja: 'よくあるご質問' },
}

export const navigation = [
  { label: 'Concept', ja: 'コンセプト', href: '#concept' },
  { label: 'Design', ja: 'デザイン', href: '#design' },
  { label: 'Menu', ja: 'メニュー・料金', href: '#menu' },
  { label: 'Access', ja: 'アクセス', href: '#access' },
]

// ------------------------------------------------------------
// 文章
// ------------------------------------------------------------
export const copy = {
  hero: {
    eyebrow: 'Nail & Relaxation Salon — Suidobashi',
    title: '指先から、\n日常を彩る。',
    lead: 'シンプルな美しさから、心ときめくトレンドデザインまで。水道橋のネイル＆リラクゼーションサロン。',
    badges: ['JR水道橋駅 徒歩2分', 'パラジェル取扱店'],
    primaryCta: '空席確認・Web予約',
    secondaryCta: 'ネイルデザインを見る',
  },
  concept: {
    title: '自分らしい美しさを、\n指先に。',
    paragraphs: [
      'オフィスにもなじむワンカラーやフレンチから、マグネット、韓国・ワンホン系のトレンドデザインまで。LeCielでは、幅広いデザインの中から、その日の気分や過ごし方に合うネイルを選べます。',
      '施術の前には、好みの色や長さ、普段の過ごし方をうかがうカウンセリングを丁寧に行います。持ち込みデザインや長さだしのご相談にも対応しています。',
      'シャンデリアが灯る、白を基調にした落ち着いた空間。半個室と完全個室で、ゆっくりと指先を整える時間をお過ごしください。',
    ],
  },
  gallery: {
    title: 'デザインから選ぶ',
    lead: '仕事の日にも合わせやすいシンプルなものから、季節やトレンドを取り入れたデザインまで。気になるカテゴリーから雰囲気をご覧ください。',
    sampleNote: 'このギャラリーの写真は、デザインの方向性を伝えるためのイメージ素材です。LeCielの実際のデザイン例は、ホットペッパービューティーのフォトギャラリーでご覧いただけます。',
    photosLinkLabel: 'LeCielのデザイン写真を見る（ホットペッパービューティー）',
  },
  menu: {
    title: 'メニューと料金',
    lead: '初めての方にも選びやすい、代表的なクーポンをご紹介します。',
    lateFeeNote: '22時以降のご来店は、深夜料金がかかります。',
    moreCta: 'すべてのメニュー・最新料金を見る',
  },
  experience: {
    title: 'LeCielで過ごす時間',
    features: [
      {
        title: '豊富なネイルデザイン',
        text: 'シンプルからトレンドまで、デザインから選べる定額メニューをご用意しています。マグネットネイルや韓国・ワンホン系のデザイン、持ち込みデザインのご相談にも対応。パラジェルの取り扱いもあります。',
        points: ['定額デザイン 30種類／50種類', 'マグネット・韓国・ワンホン', '持ち込みデザイン・長さだし'],
      },
      {
        title: '丁寧なカウンセリングとケア',
        text: '色や長さの好み、お仕事や普段の過ごし方をうかがってから、デザインを一緒に決めていきます。ハンドケアやフットケアのメニューもあり、指先全体を整える時間としてご利用いただけます。',
        points: ['施術前のカウンセリング', 'ハンドケア・フットケア', 'パラジェル取扱店'],
      },
      {
        title: '駅近で、仕事帰りにも',
        text: 'JR水道橋駅から徒歩2分。夜遅い時間帯まで受付しているため、仕事帰りにも立ち寄りやすいサロンです。半個室と完全個室があり、周りを気にせず過ごせます。',
        points: ['JR水道橋駅 徒歩2分', '夜20時以降も受付（22時以降は深夜料金）', '半個室2室・完全個室1室'],
      },
    ],
  },
  reviews: {
    title: '口コミ評価',
    lead: '2つの予約・地図サービスに寄せられた評価です。それぞれ別のサービスの数値のため、合算せずに掲載しています。',
    textNote: '口コミ本文は、各サービスの掲載ページでご覧ください。',
  },
  access: {
    title: 'アクセス',
    route: [
      { label: 'JR水道橋駅', note: '東口・西口' },
      { label: '徒歩約2分', note: '' },
      { label: 'アイロン三崎町', note: '7階' },
    ],
  },
  faq: {
    title: 'よくあるご質問',
    items: [
      {
        q: '持ち込みデザインはできますか？',
        a: '持ち込みデザインに対応しています。ただし、定額メニューの一部は持ち込み対象外、または追加料金がかかる場合があります。予約時にクーポンの条件をご確認ください。',
      },
      {
        q: 'パラジェルは選べますか？',
        a: 'パラジェル取扱店です。メニューによって、変更無料のものと追加料金がかかるものがあります。',
      },
      {
        q: '夜遅い時間でも利用できますか？',
        a: '夜20時以降も受付しています。22時以降は深夜料金がかかります。最新の営業時間・空席はWeb予約ページでご確認ください。',
      },
      {
        q: '個室はありますか？',
        a: '半個室が2室、完全個室が1室あります。',
      },
      {
        q: '駐車場はありますか？',
        a: '専用の駐車場はありません。近隣のコインパーキングをご利用ください。',
      },
    ],
  },
  finalCta: {
    title: '次のネイルを、LeCielで。',
    lead: '空席の確認とご予約は、ホットペッパービューティーのWeb予約ページから。最新のクーポン・料金もあわせてご確認いただけます。',
    primaryCta: '空席確認・Web予約',
    phoneLabel: '電話で問い合わせる',
  },
}

// ------------------------------------------------------------
// サイト設定（公開モード・SEO）
// ------------------------------------------------------------
export const site = {
  lang: 'ja',
  // 正式公開時に店舗の独自ドメインを入力します（例: 'https://example.com'）。未確定のため空欄。
  productionUrl: '',
  title: {
    demo: '【提案用デモ】ネイル＆リラクゼーションサロン LeCiel｜水道橋',
    production: 'ネイル＆リラクゼーションサロン LeCiel（ルシエル）｜水道橋駅徒歩2分のネイルサロン',
  },
  description:
    'JR水道橋駅から徒歩2分のネイル＆リラクゼーションサロン LeCiel（ルシエル）。シンプルなオフィスネイルから、マグネット・韓国・ワンホン系のトレンドデザインまで。パラジェル取扱店。',
  themeColor: '#F8F6F3',
  demoNotice: 'このページは営業提案用の非公式デモです。店舗の公式サイトではありません。',
  wordmarkNotice: 'ロゴ表記は提案用の仮デザインです。',
}

// 配色とフォント（ビルド時に <head> の CSS カスタムプロパティとして書き出します）
// 店舗ごとに色・書体を変えるときは、ここだけを編集します。
export const theme = {
  colors: {
    bg: '#F8F6F3',
    'bg-secondary': '#E4D9D3',
    accent: '#A88C73', // 装飾・細いライン専用（文字には使わない）
    'accent-ink': '#6B513D', // アクセント色の文字用（背景に対して十分なコントラスト）
    'text-muted': '#61524C',
    text: '#262322',
    white: '#FFFFFF',
    dark: '#262322',
    'dark-soft': '#3A3431',
  },
  fonts: {
    // 必要なウェイトだけを読み込みます
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Serif+JP:wght@500&display=swap',
    display: "'Cormorant Garamond', 'Noto Serif JP', serif",
    serifJa: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
    // 本文は端末の和文ゴシックを使い、ウェブフォントの通信量を抑えます
    sans: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Yu Gothic UI', 'Yu Gothic', Meiryo, sans-serif",
  },
}
