module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // the teaser and banner models intentionally keep title/subtitle/text/cta as
    // distinct cells (rather than grouping them under a shared name prefix) so each
    // renders as its own row and can be styled/positioned independently
    'xwalk/max-cells': ['error', { '*': 4, teaser: 6, banner: 5 }],
  },
};
