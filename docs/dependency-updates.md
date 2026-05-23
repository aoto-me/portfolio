# パッケージ更新状況

## 2026-05時点

### `eslint` — 9.x → 10.x（見送り中）

- 見送り理由:
  - `eslint-config-next` が内部で同梱している `eslint-plugin-react@7.37.5` が ESLint 10 で削除された API（`context.getFilename()`）を使用しているため、lint 実行時にエラーが発生する。

- 更新条件:
  - `eslint-config-next` が `eslint-plugin-react` を ESLint 10 対応版に更新されたら。

### `typescript` — 5.x → 6.x（見送り中）

- 見送り理由:
  - `eslint-config-next` に同梱されている `eslint-import-resolver-typescript@3.10.1` が TypeScript 6 の内部 API 変更に対応していないため、lint 実行時にエラーが発生する。
  - `typescript-eslint` 自体は `>=4.8.4 <6.1.0` をサポートしており、TypeScript 6.0.x は技術的に対応範囲内。ただし `eslint-config-next` 側の依存が追いついていない。

- 更新条件:
  - `eslint-config-next` が `eslint-import-resolver-typescript@4.x`（TypeScript 6 対応済み）に更新されたら。

---

### `eslint-import-resolver-typescript`（`eslint-config-next@16.2.6` の影響で追加）

- 経緯:
  - `eslint-config-next` を 16.2.6 に更新した時に、内部の依存パッケージ配置が変わり、lint 実行時に以下のエラーが全ファイルで発生するようになった。

- 原因:
  - `eslint-config-next@16.2.6` で `eslint-import-resolver-typescript` の配置が変わった。
  - `eslint-module-utils`（トップレベルに存在）がリゾルバーを探す際、トップレベルに見つからないためフォールバックで `typescript` 本体を resolver として読み込もうとし、"invalid interface" エラーになる。

| バージョン | リゾルバーの場所                                                                            |
| ---------- | ------------------------------------------------------------------------------------------- |
| 16.2.1     | `node_modules/eslint-import-resolver-typescript/`（トップレベル）                           |
| 16.2.6     | `node_modules/eslint-config-next/node_modules/eslint-import-resolver-typescript/`（ネスト） |

- 対応:
  - `eslint-import-resolver-typescript` を明示的な devDependency に追加してトップレベルに固定。

- 今後の予定:
  - `eslint-config-next` がリゾルバー管理を修正するか、ESLint の `eslint-plugin-import-x`（後継プラグイン）に移行した場合は不要になる可能性がある。`eslint-config-next` を次回更新するタイミングで外せるか確認する。
