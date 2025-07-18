import eslintParserTypeScript from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import sort from 'eslint-plugin-sort';
import ts from 'typescript-eslint';

export default [
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parser: eslintParserTypeScript,
    },
  },
  // React
  react.configs.flat?.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      sort,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error', // or "error"
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react/prop-types': 'off',
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      'sort/exports': 'off',
      'sort/import-members': 'off',
      'sort/imports': 'off',
      'sort/object-properties': 'error',
      'sort/string-enums': 'error',
      'sort/string-unions': 'error',
      'sort/type-properties': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
