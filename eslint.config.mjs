import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: Object.fromEntries(
      Object.keys(require('eslint/conf/environments.json')).map(rule => [rule, 'off'])
    )
  }),
]

export default eslintConfig
