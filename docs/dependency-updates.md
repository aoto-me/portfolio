# パッケージ更新状況（2026年7月）

## 今の状態

| パッケージ                          | 現在  | 備考             |
| ----------------------------------- | ----- | ---------------- |
| `eslint-import-resolver-typescript` | 4.x   | 明示的に固定     |
| `typescript`                        | 6.0.3 | 7.x系は見送り中  |
| `eslint`                            | 9.x   | 10.x系は見送り中 |
| `eslint-plugin-unicorn`             | 64.x  | 72.x系は見送り中 |

&nbsp;

## `eslint-import-resolver-typescript` を別途インストールしている理由

`eslint-import-resolver-typescript` は、ESLintが「import文はが実在するファイルを指してるか」をTypeScriptのパスエイリアス（`@/`など）込みで判定するための部品。<br/>
本来は `eslint-config-next` が内部で持っているので、自分で入れる必要はないはず。<br/>
ただし `eslint-config-next` のバージョンによって、この部品の置き場所が変わることがある。

| 置き場所                                                          | 何が起きるか                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `node_modules/eslint-import-resolver-typescript/`（トップレベル） | 問題なし                                                                                                     |
| `node_modules/eslint-config-next/node_modules/...`（ネストの奥）  | ESLint側が探しに行く場所（トップレベル固定）と食い違い、"invalid interface" エラーで全ファイルのlintが落ちる |

これを避けるため、`package.json` に `eslint-import-resolver-typescript` を明示的なdevDependencyとして追加し、トップレベルに固定している。

現在は4系（`^4.4.5`）を使用。<br/>
`eslint-config-next` 側は内部で3系を要求するため、トップレベルの4系とネストされた3系が共存する形になるが、Nodeのmodule resolutionは「プロジェクトルートに近い方」を優先するため、トップレベルの4系が使われ問題ない（`npm run lint` / `npm run build` で確認済み）。

### 今後の対応

もし今後 `eslint-config-next` がresolverの管理方法を直す、または後継の `eslint-plugin-import-x` に移行したら、この個別のインストールは不要になる可能性がある。<br/>
`eslint-config-next` を更新するタイミングで確認した方がいい。

&nbsp;

## 見送り中

### `typescript` — 7.x系

現在は `typescript-eslint@8.63.0` が対応している範囲（`>=4.8.4 <6.1.0`）内の `6.0.3` を使用。<br/>
7.x系は `typescript-eslint` がまだ未対応のため見送り中。`typescript-eslint` が対応したら更新できる。<br/>
なお、上記のresolverのバージョン（3系/4系）とTypeScript 6系が問題なく動くかどうかは無関係。

### `eslint` — 9.x → 10.x

`eslint-config-next` が内部で使っている `eslint-plugin-react@7.37.5` が、ESLint 10 で廃止されたAPI（`context.getFilename()`）を使っているため、更新するとlintがエラーになる（`node_modules/eslint-plugin-react/lib/rules/jsx-filename-extension.js:64` で使用箇所を確認済み）。

**更新できる条件**: `eslint-config-next` が `eslint-plugin-react` をESLint 10対応版に上げること。

### `eslint-plugin-unicorn` — 64.x → 72.x

新しいバージョンが `eslint: >=10.4` を要求するため、上の `eslint` 10.x 更新待ち。
