import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': env,
      __APP_ENV__: env.APP_ENV,
    },
    server: {
      host: "::",
      port: 5173,
    },
    plugins: [
      react(),
      ...(mode === 'development' ? [componentTagger()] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === 'development',
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});