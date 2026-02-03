module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:prettier/recommended', // Must be last
  ],
  plugins: ['simple-import-sort'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        'import/no-unresolved': 'off', // Covered by TS
        '@typescript-eslint/indent': 'off', // specific rule disabling
        'import/extensions': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-filename-extension': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['airbnb-typescript/base', 'plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        'import/extensions': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off', // Let inference work
      },
    },
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/extensions': 'off', // Bundlers handle this
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'class-methods-use-this': 'off',
    indent: 'off',
    '@typescript-eslint/indent': 'off',
  },
};
