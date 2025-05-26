// er.config.config.ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'elegant-router';

export default defineConfig({
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  },
  // 页面目录
  pageDir: 'src/views',
  // 布局配置
  layouts: {
    base: 'src/layouts/base/index.vue',
    blank: 'src/layouts/blank/index.vue'
  },
  // 根路由重定向
  rootRedirect: '/home',
  // 404 路由组件
  notFoundRouteComponent: 'NotFound'
});
