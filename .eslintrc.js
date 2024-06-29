module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'prettier/prettier': [
      'off',
      {
        endOfLine: 'auto'
      }
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^node:'],
          // Packages. `react` related packages come first.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`
          // Anything that does not start with a dot.
          ['^@lib'],
          ['^@common'],
          ['^@modules'],
          ['^@entities'],
          ['^@utils'],
          // Anything that starts with a dot.
          ['^\\./', '^\\.\\./']
        ]
      }
    ],
    'simple-import-sort/exports': 'error'
  }
};
