export default [
  {
    test: {
      name: 'node',
      root: './packages',
      include: [
        'qvite/**/*.{test,spec}.ts',
        'vite-plugins/**/*.{test,spec}.ts',
        'color/**/*.{test,spec}.ts',
        'unocss/**/*.{test,spec}.ts',
        'utils/**/*.{test,spec}.ts'
      ],
      environment: 'node'
    }
  },
  {
    test: {
      name: 'scripts',
      root: './scripts',
      include: ['**/*.{test,spec}.ts'],
      environment: 'node'
    }
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'jsdom',
      root: './packages',
      include: [
        'naive-extra/**/*.{test,spec}.{ts,tsx}',
        'box/**/*.{test,spec}.{ts,tsx}',
        'directives/**/*.{test,spec}.{ts,tsx}',
        'axios/**/*.{test,spec}.{ts,tsx}',
        'is/**/*.spec.ts'
      ],
      environment: 'jsdom'
    }
  }
]
