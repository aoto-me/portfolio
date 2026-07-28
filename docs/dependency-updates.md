# パッケージ更新状況

最終更新: 2026-07-28

## 今の状態

| パッケージ                          | 現在  | 備考                              |
| ----------------------------------- | ----- | --------------------------------- |
| `eslint-import-resolver-typescript` | 4.x   | 明示的に固定                      |
| `typescript`                        | 6.0.3 | 7.x系は見送り中                   |
| `eslint`                            | 9.x   | 10.x系は見送り中                  |
| `eslint-plugin-unicorn`             | 65.x  | 66.x系以降は`eslint` 10.x待ち     |
| `postcss` / `sharp`                 | -     | `next` が固定しているため更新不可 |

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

現在は `typescript-eslint@8.65.0`（最新）が対応している範囲（`>=4.8.4 <6.1.0`）内の `6.0.3` を使用。<br/>
7.x系は `typescript-eslint` がまだ未対応のため見送り中。`typescript-eslint` が対応したら更新できる。<br/>
なお、上記のresolverのバージョン（3系/4系）とTypeScript 6系が問題なく動くかどうかは無関係。

`typescript@7.0.2` のインストールを試すと、npm がpeer依存の衝突で拒否する（`--dry-run` で確認済み）。

### `eslint` — 9.x → 10.x

`eslint-config-next` が内部で使っている `eslint-plugin-react@7.37.5` が、ESLint 10 で廃止されたAPI（`context.getFilename()`）を使っているため、更新するとlintがエラーになる。使用箇所は2つ確認済み。

- `lib/rules/jsx-filename-extension.js:64` — `context.getFilename()`
- `lib/util/version.js:31` — `contextOrFilename.getFilename()`

実際に `eslint@10.8.0` を入れて `npm run lint` を実行すると、後者で全ファイルのlintが停止する。

`eslint-plugin-react` は最新の `7.37.5` でもpeerが `eslint: ^3 || ... || ^9.7` までで、ESLint 10 に未対応。<br/>
つまり `eslint-config-next` 側だけの問題ではなく、`eslint-plugin-react` 本体の対応リリース待ち。

**更新できる条件**: `eslint-plugin-react` がESLint 10対応版を出し、`eslint-config-next` がそれを取り込むこと。

### `eslint-plugin-unicorn` — 66.x以降

66.x以降が `eslint: >=10.4` を要求するため、上の `eslint` 10.x 更新待ち。<br/>
65.x は `eslint: >=9.38.0` なので現在の `eslint@9.39.5` で動作する。<br/>
**ESLint 9 で使える上限が 65.x** となるため、そこまでは更新済み。

&nbsp;

## `next` が固定している推移的依存（`postcss` / `sharp`）

`package.json` に書いていないが、`next` の依存として入っている2つに脆弱性アドバイザリが出ている。<br/>
どちらも `next` 側がバージョンを固定しているため、**こちらの操作では更新できない**。

| パッケージ | 現在   | 安全なバージョン | `next` 側の指定                 |
| ---------- | ------ | ---------------- | ------------------------------- |
| `postcss`  | 8.4.31 | `>=8.5.10`       | `postcss: "8.4.31"`（完全固定） |
| `sharp`    | 0.34.5 | `>=0.35.0`       | `sharp: "^0.34.5"`              |

最新の `next@16.2.12` でもこの指定は変わっていない。**`next` 本体が上げるまで解消不可。**

### GitHub Actions が失敗し続ける件

この2件が原因で、Dependabotのsecurity updateジョブが `security_update_not_possible` で失敗する。<br/>
リポジトリ自体のCIワークフローは存在しないため、**Actionsタブに並ぶ失敗はすべてDependabot由来**で、ビルドが壊れているわけではない。
