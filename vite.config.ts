import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript2 from 'rollup-plugin-typescript2'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    }),
    // cssInjectedByJsPlugin(),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          outDir: 'dist',
          sourceMap: true,
          declaration: true,
          declarationMap: true
        }
      },
      exclude: ['vite.config.ts']
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'vue-calendar-3'
    },
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('src/main.ts', import.meta.url))
      },
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
