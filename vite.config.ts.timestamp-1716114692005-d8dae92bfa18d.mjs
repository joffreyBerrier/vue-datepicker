// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/joffreyberrier/website/lc/others/vue-datepicker/node_modules/.pnpm/vite@5.2.11_@types+node@20.12.12/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/joffreyberrier/website/lc/others/vue-datepicker/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.11_@types+node@20.12.12__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/joffreyberrier/website/lc/others/vue-datepicker/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.12.12_rollup@4.17.2_typescript@5.4.5_vite@5.2.11_@types+node@20.12.12_/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/joffreyberrier/website/lc/others/vue-datepicker/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("src/index.ts", __vite_injected_original_import_meta_url)),
      name: "vue-calendar-3",
      fileName: "vue-calendar-3"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvam9mZnJleWJlcnJpZXIvd2Vic2l0ZS9sYy9vdGhlcnMvdnVlLWRhdGVwaWNrZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qb2ZmcmV5YmVycmllci93ZWJzaXRlL2xjL290aGVycy92dWUtZGF0ZXBpY2tlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvam9mZnJleWJlcnJpZXIvd2Vic2l0ZS9sYy9vdGhlcnMvdnVlLWRhdGVwaWNrZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCksIGR0cygpXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJ3NyYy9pbmRleC50cycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgbmFtZTogJ3Z1ZS1jYWxlbmRhci0zJyxcbiAgICAgIGZpbGVOYW1lOiAndnVlLWNhbGVuZGFyLTMnXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgdnVlOiAnVnVlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLGVBQWUsV0FBVztBQUV2WCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBSm9NLElBQU0sMkNBQTJDO0FBT3JRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDdEIsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxjQUFjLElBQUksSUFBSSxnQkFBZ0Isd0NBQWUsQ0FBQztBQUFBLE1BQzdELE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsS0FBSztBQUFBLE1BQ2hCLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
