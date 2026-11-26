# LeCiel 提案用デモサイト

水道橋のネイルサロン「ネイル＆リラクゼーションサロン LeCiel」に向けた、**営業提案用の非公式デモサイト**です。店舗の公式サイトではありません。

- デザインコンセプト：Quiet Elegance — 指先から、日常を彩る。
- 使用技術：React 19 ＋ Vite（JavaScript）、通常の CSS
- 予約は、店舗のホットペッパービューティー掲載ページへ案内します（独自の予約フォームはありません）

関連ドキュメント：

| ファイル | 内容 |
| --- | --- |
| [RESEARCH.md](RESEARCH.md) | 店舗情報の調査記録と、依頼時の情報との違い |
| [IMAGE_SOURCES.md](IMAGE_SOURCES.md) | 写真の出典・ライセンスと、店舗にお願いしたい写真 |
| [OWNER_CHECKLIST.md](OWNER_CHECKLIST.md) | 公開前に店舗オーナーの承認が必要な項目 |

---

## 1. 準備

Node.js（バージョン20以上）が必要です。

> このMacでは Node.js が `~/.local/node/bin` にあり、標準の PATH に入っていません。ターミナルを開いたら、最初に次を実行してください。
>
> ```bash
> export PATH="$HOME/.local/node/bin:$PATH"
> ```

プロジェクトのフォルダに移動して、必要なパッケージを入れます（初回だけ）。

```bash
cd ~/Desktop/webサイト/leciel-nail-salon
npm install
```

## 2. 手元で表示する

```bash
npm run dev
```

ターミナルに表示される `http://localhost:5173/` をブラウザで開きます。ファイルを保存すると、画面が自動で更新されます。止めるときは `Ctrl + C` を押します。

## 3. 公開用ファイルを作って確認する

```bash
npm run build     # dist/ フォルダに公開用ファイルを作る（デモモード）
npm run preview   # http://localhost:4173/ で、作ったファイルを確認する
```

`npm run build` は、ページの HTML をあらかじめ書き出す処理（プリレンダー）も自動で行います。

## 4. テストを実行する

```bash
npm test
```

Mac にインストール済みの Google Chrome を使って、次の項目を自動で確認します（16項目）。

- 375／390／768／1024／1440px で横スクロール・画像切れ・コンソールエラーがない
- デモ用の noindex が有効で、構造化データが出力されていない
- 予約・メニュー・電話・Googleマップのリンク先
- ギャラリーの絞り込み（マウスとキーボード）
- スマートフォンのメニュー開閉、Esc キー、フォーカスの戻り
- 下部固定の予約ボタンがフッターを隠さない
- axe による WCAG 2.2 AA の自動チェック

コードの書き方のチェックは `npm run lint` で行います。

---

## 5. 店舗情報を変更する

店舗名・住所・電話番号・営業時間・メニュー・価格・口コミ評価・予約URL・写真の説明・文章・配色・書体は、すべて **`src/config/business.js`** にまとめています。部品（`src/components/`）には店舗固有の情報を書いていません。

例：料金を変更する

```js
// src/config/business.js
export const menuItems = [
  {
    name: 'オフィス向けシンプルデザイン',
    detail: 'ワンカラー＋アート2本相当',
    price: 5300,        // ← ここを変更（カンマなしの数字）
    target: '新規',
    conditions: ['ジェルオフ無料（スカルプのオフは別料金）', 'ドライケア込み'],
  },
  // ...
]
```

- 料金や評価を更新したら、`RESEARCH_DATE`（確認日）も更新してください
- 色を変えるときは `theme.colors` を編集します（ページの `<head>` に自動で書き出されます）
- 別の店舗に使い回すときは、このファイルと写真を差し替えます

## 6. 写真を差し替える

1. 新しい写真を `assets-src/` に入れます。**同じファイル名**（例：`hero-nude-beige.jpg`）で上書きすると、設定を変えずに差し替えられます
2. 新しい名前にした場合は、`src/config/business.js` の `images` または `galleryItems` の `file` を、拡張子を除いたファイル名に変更します
3. 次のコマンドで、表示用の WebP（480／960／1440px）を作り直します

   ```bash
   npm run images
   ```

4. `alt`（写真の説明文）を写真の内容に合わせて書き換えます
5. 店舗の実際の写真に変えた場合は、`isSample: true` を外すか `false` にすると、「イメージ」表示が消えます（ギャラリーの表示文言は `copy.gallery.sampleNote` で変更）
6. [IMAGE_SOURCES.md](IMAGE_SOURCES.md) の表を更新します

ギャラリーの写真は `ratio`（表示の縦横比、例：`'4 / 5'`）と `position`（切り抜きの中心、例：`'50% 40%'`）で見え方を調整できます。

> ホットペッパービューティー・Googleマップ・Instagram の写真は、公開されていても無断で使わないでください。店舗から提供・許可を受けた写真だけを使います。

---

## 7. デモモードと正式公開モード

| | デモモード（既定） | 正式公開モード |
| --- | --- | --- |
| コマンド | `npm run build` | `npm run build:production` |
| 検索エンジン | `noindex,nofollow`、robots.txt で全体を拒否 | `index,follow`、robots.txt と sitemap.xml を出力 |
| title・OGP・canonical | デモ用タイトルのみ | 正式なタイトル・OGP・canonical を出力 |
| 構造化データ | 出力しない | NailSalon（LocalBusiness 系）を出力 |
| 画面の表示 | 上部と下部に「非公式デモ」の表示 | 表示しない |

**noindex はアクセス制限ではありません。** URL を知っている人は誰でも見られます。デモを外部に置く場合は、必ずアクセス制限（下記）をかけてください。

正式公開モードは、次の条件がそろわないとビルドが止まるようにしています（誤公開の防止）。

- `src/config/business.js` の `site.productionUrl` に正式ドメインが入っている（または環境変数 `VITE_PRODUCTION_URL`）
- `vercel.json` から `X-Robots-Tag`（noindex）の設定が削除されている

---

## 8. Vercel で公開する手順

**店舗オーナーの承認を得るまで、公開・デプロイは行わないでください。**（[OWNER_CHECKLIST.md](OWNER_CHECKLIST.md)）

### 8-1. 承認前に、関係者だけで確認したい場合

1. GitHub に**非公開（Private）**リポジトリを作り、このフォルダを登録します
2. Vercel にログインし、「Add New → Project」からリポジトリを取り込みます
3. Framework Preset は「Vite」、Build Command は `npm run build`、Output Directory は `dist` のままで構いません
4. プロジェクトの Settings → Deployment Protection で、閲覧できる人を制限します（Vercel にログインしたメンバーだけに見せる方法や、パスワード保護などがあります。プランによって使える方法が異なるため、Vercel の公式ドキュメントで確認してください）
5. `vercel.json` の noindex ヘッダーと、ページ内の noindex は残したままにします

### 8-2. 承認後に正式公開する場合

1. 正式ドメインを決め、`src/config/business.js` の `site.productionUrl` に入れます（例：`'https://（店舗のドメイン）'`）
2. `vercel.json` から `X-Robots-Tag` のブロックを削除します（キャッシュ設定は残します）
3. Vercel の Settings → Build and Deployment で Build Command を `npm run build:production` に変更します
4. Settings → Domains で正式ドメインを追加し、表示される DNS 設定をドメインの管理画面に登録します
5. 公開後、`https://（ドメイン）/robots.txt` と `sitemap.xml` が表示されること、ページのソースに `noindex` がないことを確認します
6. Google Search Console にドメインを登録し、`sitemap.xml` を送信します
7. Googleビジネスプロフィールのウェブサイト欄に正式URLを登録するかを店舗と相談します

---

## 9. フォルダ構成

```
assets-src/            写真の元画像（ここを差し替える）
public/images/         表示用に変換した写真（npm run images で自動生成）
scripts/
  optimize-images.mjs  写真を WebP に変換
  prerender.mjs        ビルド後に HTML を書き出す
src/
  config/business.js   店舗情報・文章・配色・書体（ここを編集する）
  config/image-manifest.json  写真のサイズ情報（自動生成）
  components/          ページの各セクション
  styles/global.css    デザイン（レイアウト・余白・文字）
  App.jsx              セクションの並び
tests/site.spec.js     自動テスト
vite.config.js         デモ／正式公開モードの切り替え、SEO 設定の書き出し
vercel.json            Vercel 用の設定（デモ中は noindex ヘッダー）
```

## 10. 計測の記録（2026年11月26日、ローカル環境）

Lighthouse 12、Google Chrome、ビルド済みファイルを手元のサーバーで配信して計測しました。実際の公開環境（Vercel）での値ではありません。

| 条件 | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| モバイル（既定のシミュレーション） | 99 | 100 | 100 | 66※ | 1.9秒 | 0.001 |
| モバイル（devtools スロットリング） | 99 | 100 | 100 | 66※ | 1.7秒 | 0.001 |
| デスクトップ | 100 | 100 | 100 | 66※ | 0.4秒 | 0.002 |
| 正式公開モード（検証用ドメイン example.com） | — | 100 | 100 | 100 | — | — |

※デモモードは意図的に noindex にしているため、SEO の点数が下がります。

INP（操作への反応速度）は、公開後の実際の利用データでしか計測できないため、未計測です。
