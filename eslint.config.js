// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // Tests unitaires : globals de Jest.
    files: ['**/__tests__/**/*.js'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    // Tests Detox : globals de Jest et de Detox.
    files: ['e2e/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        device: 'readonly',
        element: 'readonly',
        by: 'readonly',
        waitFor: 'readonly',
      },
    },
  },
]);
