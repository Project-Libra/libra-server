module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  rules: {
    // Typescript
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/naming-convention': 'off',
    // General
    'linebreak-style': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'operator-linebreak': ['error', 'after'],
    'arrow-parens': ['error', 'as-needed'],
    'no-await-in-loop': 'off',
    'no-console': ['error', {
      allow: ['error', 'warn', 'info']
    }],
    'max-len': 'off',
    // Import
    'import/prefer-default-export': 'off',
    'import/order': ['error', {
      groups: [
        'builtin',
        ['external', 'internal'],
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always-and-inside-groups'
    }]
  }
};