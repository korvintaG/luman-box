const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module', // Используем 'module' для ES модулей в коде
      globals: {
        ...globals.node, // Глобальные переменные для Node.js
        ...globals.jest, // Глобальные переменные для Jest
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-unused-modules': [
        'error',
        {
          unusedExports: true, // Проверять неиспользуемые экспорты
          missingExports: true, // Проверять отсутствующие экспорты
        },
      ],
    },
  },
];