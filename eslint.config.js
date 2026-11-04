import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,

  {
    name: 'app/rules',
    rules: {
      // JS quality
      'no-console':    ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-debugger':   'warn',
      'prefer-const':  'error',
      'no-var':        'error',
      'eqeqeq':        ['error', 'always', { null: 'ignore' }],
      // Team convention: no else / else-if in script code; use early returns and guard clauses.
      // (Template v-else / v-else-if are directives, not statements, so they aren't affected.)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'IfStatement[alternate]',
          message: 'Avoid else; use an early return or a guard clause.',
        },
      ],

      // Vue quality
      'vue/multi-word-component-names':      'off',
      'vue/no-unused-vars':                  'warn',
      'vue/no-unused-components':            'warn',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/no-v-html':                       'off',
      'vue/require-default-prop':            'off',
      'vue/prop-name-casing':                ['error', 'camelCase'],
      'vue/no-mutating-props':               'error',
      'vue/no-template-shadow':              'warn',
      'vue/v-bind-style':                    ['error', 'shorthand'],
      'vue/v-on-style':                      ['error', 'shorthand'],
      'vue/block-order':                     ['error', { order: ['template', 'script', 'style'] }],
    },
  },
])
