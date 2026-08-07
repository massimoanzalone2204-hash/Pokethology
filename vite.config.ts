import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {compression} from 'vite-plugin-compression2';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      compression(),
      compression({
        algorithms: ['brotliCompress'],
        exclude: [/\.(gz)$/i],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: false, 
    },
    build: {
      outDir: 'dist',
      // Production build optimizations
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 3000,
      modulePreload: {
        polyfill: true,
      },
    },
  };
});
