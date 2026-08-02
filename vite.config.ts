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
      chunkSizeWarningLimit: 1200,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              if (id.includes('react-markdown') || id.includes('react-player')) {
                return 'vendor-media';
              }
              return 'vendor-libs';
            }

            // Split heavy application components into distinct feature chunks
            if (id.includes('/src/components/')) {
              if (id.includes('Battle') || id.includes('Combat')) {
                return 'battle-arena-chunk';
              }
              if (id.includes('Modal') || id.includes('Tutorial') || id.includes('Quiz') || id.includes('PokemonList')) {
                return 'pokedex-modal-chunk';
              }
            }
          },
        },
      },
    },
  };
});
