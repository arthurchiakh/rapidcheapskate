import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults, UserConfigFnObject } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((env) => {
  return mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url))
      }
    })
  );
});
