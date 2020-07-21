const {packages} = require('./lerna.json');
const projects = packages.map(spec => `${spec}/tsconfig.json`);

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: [
      './jsconfig.json',
      ...projects
    ],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
