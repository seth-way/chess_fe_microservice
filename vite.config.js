// vite.config.js in todo-components
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chess-components',
      filename: 'remoteEntry.js',
      exposes: {
        './Board': './src/components/Board/Board.jsx',
      },
      shared: ['react'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
