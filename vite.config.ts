import { URL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy } from './build/config/proxy';

// https://vite.dev/config/
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as ImportMetaEnv;

  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;

  return {
    plugins: setupVitePlugins(loadEnv(configEnv.mode, process.cwd()) as unknown as ImportMetaEnv),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: createViteProxy(viteEnv, enableProxy),
      fs: {
        cachedChecks: false
      }
    }
  };
});
