// examples/example-app/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-filter-builder': path.resolve(__dirname, '../../src'),
      '@': path.resolve(__dirname, '../../src'),
    },
    dedupe: ['react', 'react-dom'],
  },
});