# ポートフォリオサイト

制作物の紹介のために Next.js + microCMS で制作した個人ポートフォリオサイトです。<br/>
好きなデザインと Web サイトとしての品質（パフォーマンス・アクセシビリティ・SEO）の両立を目標に制作しました。

- 個人開発
- 制作期間：2025年 - 2026年
- URL：https://portfolio.1coffee9milk.com

&nbsp;

## スクリーンショット

<video src="https://github.com/user-attachments/assets/3aaab69d-5efc-4f23-b864-53646583d019" controls width="100%"></video>

&nbsp;

## サイト構成

| パス          | ページ       | 概要                          |
| ------------- | ------------ | ----------------------------- |
| `/`           | トップページ | 作品一覧スライダー            |
| `/works/[id]` | 作品詳細     | microCMS から取得した作品情報 |
| `*`           | 404 ページ   | カスタムエラーページ          |

&nbsp;

## 技術スタック

| 技術                    | 用途                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| Next.js 16 (App Router) | フレームワーク・静的サイト生成                                       |
| React 19                | UI                                                                   |
| TypeScript              | 型安全性の確保                                                       |
| Three.js                | WebGL 背景レンダリング                                               |
| GSAP                    | アニメーション                                                       |
| microCMS                | ヘッドレス CMS（作品コンテンツ管理）                                 |
| ESLint                  | 静的解析（unicorn / perfectionist / jsx-a11y / security プラグイン） |
| Prettier                | コードフォーマッター                                                 |
| Husky + lint-staged     | コミット前の自動フォーマット・Lint                                   |

&nbsp;

## 主な実装ポイント

### パフォーマンス

Core Web Vitals の基準（LCP 2.5 秒以内・INP 200ms 未満・CLS 0.1 未満）のクリアを目標に、初期ロードへの影響が大きい箇所を中心に最適化しています。

- **Web フォントの非同期読み込み** — `next/font` はレンダリングをブロックするため使用せず、`requestIdleCallback` でアイドル時に `<link>` を動的挿入
- **画像の遅延読み込み** — ファーストビューは `loading="eager"`、スライダー2枚目以降は `loading="lazy"` など画像ごとに読み込みタイミングを設定
- **Three.js の遅延読み込み** — `next/dynamic` で初期バンドルから除外し、`requestIdleCallback` でレンダリング自体も遅延

### アクセシビリティ

WCAG 2.2 のレベル AA への準拠を目標として設計・実装しています。

- **セマンティック HTML** — `header` / `main` / `nav` など適切な要素で文書構造をマークアップ
- **スクリーンリーダー** — 読み上げ時の内容や順序を考慮し、`aria-*` 属性や visually-hidden テキストを利用
- **コントラスト比** — 全てのページのテキスト・非テキストでコントラスト比 4.5:1 以上を確保

### SEO

公開サイトは `noindex` / `nofollow` を利用しており、実際の検索流入はありませんが、Web サイトの品質指標として SEO を意識した実装をしています。

- **構造化データ（JSON-LD）** — `ItemList` / `CreativeWork` / `BreadcrumbList` を実装
- **サイトマップ・robots.txt** — `sitemap.ts` / `robots.ts` で動的生成
- **OGP / canonical URL** — 全ページの `head` に設定

### デザイン

青や紫を基調に、星やノイズ、装飾を組み合わせ、静かに流動する雰囲気を意識してデザインしました。<br/>
背景やページ遷移にはアニメーションを取り入れ、サイト全体の雰囲気を演出しています。

- **WebGL 背景** — Three.js を利用してテクスチャを歪ませた背景のゆらぎや星のパーティクルを実装
- **ページ遷移** — GSAP と SVG フィルターを利用してページが溶けるような遷移を演出
