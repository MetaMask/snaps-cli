module.exports = {
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/nodejs',
  ],
  plugins: [
    'json',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    semi: [2, 'always'],
    'space-before-function-paren': 'off',
  },
  overrides: [
    {
      files: [
        'snaps-cli.js',
        'src/**/*.js',
      ],
      env: {
        node: true,
      },
      globals: {
        snaps: true,
      },
      rules: {
        'node/no-process-exit': 'off',
      },
    },
    {
      files: [
        'examples/**/*.js',
      ],
      env: {
        browser: true,
      },
      globals: {
        wallet: true,
      },
      rules: {
        'no-alert': 'off',
      },
    },
  ],
  ignorePatterns: [
    '!.eslintrc.js',
    'dist/',
    'node_modules/',
  ],
};
