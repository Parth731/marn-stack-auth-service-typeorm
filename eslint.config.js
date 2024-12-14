import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.node,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021, // Supports modern JavaScript syntax
        sourceType: 'module', // Use "script" for CommonJS
      },
    },
  },
  {
    ignores: ['dist', 'node_modules'],
    rules: {
      //* ES6
      'arrow-spacing': 'error',
      'no-confusing-arrow': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'object-shorthand': 'off',
      'prefer-const': 'error',
      'prefer-template': 'warn',

      //* must setting
      'no-console': 'off',
      'dot-notation': 'error',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',

      //* Avoid Bugs
      'no-undef': 'error',
      semi: 'error',
      'semi-spacing': 'error',
      //* Best Practices
      eqeqeq: 'warn',
      'no-invalid-this': 'error',
      'no-return-assign': 'error',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-constant-condition': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next|__' }],

      // // Function parameter-specific rules
      // '@typescript-eslint/explicit-module-boundary-types': 'error', // Require explicit types for exported functions and parameters
      // '@typescript-eslint/parameter-properties': [
      //   'error',
      //   {
      //     prefer: 'class-property',
      //   },
      // ],
      // '@typescript-eslint/no-empty-function': 'warn', // Warn against empty functions
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
