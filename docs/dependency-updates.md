# パッケージ更新状況

## 2026-07時点

### `typescript` — 5.x → 6.0.3（更新済み）

- 対応:
  - `typescript-eslint@8.63.0` の対応範囲（`>=4.8.4 <6.1.0`）内である `6.0.3` に更新。
  - `eslint-import-resolver-typescript@3.10.1`（`eslint-config-next` 同梱）のままでも `npm run lint` / `npm run build` ともにエラーは発生しなかった。以前記録した「TS6内部API非対応でlintエラー」という懸念は、少なくとも安定版6.0.3 + このプロジェクトの構成では再現しなかった（resolver 4系への更新は別件として実施済みだが、本更新自体はresolver更新に依存しない）。
  - TypeScript 7.x は `typescript-eslint` が未対応（`<6.1.0`）のため見送り。

### `eslint` — 9.x → 10.x（見送り中）

- 見送り理由:
  - `eslint-config-next` が内部で同梱している `eslint-plugin-react@7.37.5` が ESLint 10 で削除された API（`context.getFilename()`）を使用しているため、lint 実行時にエラーが発生する。
  - 2026-07時点でも `eslint-config-next@16.2.10` は `eslint-plugin-react: ^7.37.0` を要求しており、インストールされる実体は依然 `7.37.5`（`node_modules/eslint-plugin-react/lib/rules/jsx-filename-extension.js:64` で `context.getFilename()` 使用を確認）。状況は変わっていない。

- 更新条件:
  - `eslint-config-next` が `eslint-plugin-react` を ESLint 10 対応版に更新されたら。

### `eslint-plugin-unicorn` — 64.x → 71.x（見送り中）

- 見送り理由:
  - peer dependency が `eslint: >=10.4` のため、上記 `eslint` 10.x 更新待ち。

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
