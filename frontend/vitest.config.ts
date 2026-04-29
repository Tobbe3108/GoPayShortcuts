/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    // include all test files (both .test.ts and .spec.ts), not only .svelte ones
    include: ['src/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules',
      '.svelte-kit',
      'build',
      // These tests hang in jsdom due to lucide-svelte/Svelte 5 runtime incompatibility
      // (Svelte 5 tries to fetch attachments.js which is blocked by test setup's fetch stub)
      'src/**/Icon.svelte.spec.ts',
      'src/**/OrderCard.svelte.spec.ts'
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,svelte}'],
      exclude: [
        'src/**/*.svelte.{test,spec}.ts',
        'src/**/*.d.ts',
        '.svelte-kit/**',
        'build/**'
      ],
      // Minimal thresholds to start with — will fail CI if below these values
      thresholds: {
        global: { statements: 60, branches: 50, functions: 60, lines: 60 }
      }
    }
  }
});
