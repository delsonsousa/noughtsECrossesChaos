// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    settings: {
      'import/ignore': [
        'node_modules[\\\\/]+@?react-native',
        'node_modules[\\\\/]+react-native-svg',
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
