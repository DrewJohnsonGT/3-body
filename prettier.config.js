const config = {
  endOfLine: 'lf',
  importOrder: ['^react$', '<THIRD_PARTY_MODULES>', '^@pcit/(.*)$', '^~/(.*)$', '', '^.*\\.(css|scss|sass)$'],
  jsxBracketSameLine: false,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 120,
  proseWrap: 'always',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default config;
