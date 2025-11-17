import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn: eslintPluginUnicorn,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...eslintConfigPrettier.rules,
      // eslint base rules
      'no-lonely-if': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'consistent-return': 'off',

      // unicorn
      'unicorn/consistent-destructuring': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-ternary': 'error',

      // prettier
      'prettier/prettier': 'error',
    },
  },
);

