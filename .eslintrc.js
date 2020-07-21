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
    project: projects,
    tsconfigRootDir: __dirname,
  },
};
