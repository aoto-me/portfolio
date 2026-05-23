import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import unicorn from 'eslint-plugin-unicorn';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import security from 'eslint-plugin-security';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'dist/**', 'node_modules/**']),

  // TypeScript強化
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true, // 自動検出
      },
    },
    rules: {
      '@typescript-eslint/no-dynamic-delete': 'off', // 動的 delete の利用を許可
      '@typescript-eslint/no-invalid-void-type': 'off', // voidを戻り値以外の場所で使うことを許可
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }], // HTML属性（onClickなど）で void 型を返す(Promiseを使用してもエラーにしない)
      '@typescript-eslint/no-non-null-assertion': 'off', // ! を許可する
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 引数名がアンダースコア（_）で始まる場合、その引数を未使用として無視する
    },
  },

  // import（Nextの設定を上書き）
  {
    files: ['**/*.{ts,tsx}'],
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
    },
  },

  // 未使用import削除
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Unicorn（コード品質）
  {
    files: ['**/*.{ts,tsx}'],
    extends: [unicorn.configs.recommended],
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off', // テンプレートリテラル内でのstringの明示をoff
      'unicorn/prefer-query-selector': 'off', // document.getElementById より、.querySelector() を使った方が良いという警告をoff
      'unicorn/filename-case': 'off', // ファイル名のルールを無効化
      'unicorn/no-abusive-eslint-disable': 'off', // disableの有効化
      'unicorn/no-array-reduce': 'off', // reduce()の使用を許可
      'unicorn/no-array-sort': 'off', // sort()の使用を許可
      'unicorn/no-null': 'off', // null を使う代わりに undefined を使うルールをoff
      'unicorn/prefer-at': 'off', // 「array[array.length - 1] よりも array.at(-1) を使わせるルールをoff
      'unicorn/prevent-abbreviations': 'off', // 短縮表記を許容する
    },
  },

  // JSXアクセシビリティ強化（Nextの設定を上書き）
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'jsx-a11y/media-has-caption': 'off',
    },
  },

  // import並び替え
  {
    files: ['**/*.{ts,tsx}'],
    extends: [perfectionist.configs['recommended-natural']],
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            ['builtin', 'external', 'internal'],
            ['parent', 'sibling', 'index'],
          ],
          newlinesBetween: 0,
          type: 'natural',
        },
      ],
    },
  },

  // セキュリティ
  {
    files: ['**/*.{ts,tsx}'],
    extends: [security.configs.recommended],
  },

  // Prettier（競合回避）
  {
    extends: [prettier],
  },
]);

export default eslintConfig;
