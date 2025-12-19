module.exports = {
  extends: ['@kouts/eslint-config/vue3'],
  overrides: [
    {
      // Disable multi-word-component-names for pages and layouts
      files: ['src/views/**/*.vue', 'src/layouts/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto'
          }
        ]
      }
    },
    {
      // Enable vitest plugin for test files
      files: ['tests/**/*.{test,spec}.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
      plugins: ['@vitest'],
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly'
      },
      rules: {
        '@vitest/expect-expect': 'warn',
        '@vitest/no-identical-title': 'error',
        '@vitest/no-focused-tests': 'error'
      }
    }
  ]
}
