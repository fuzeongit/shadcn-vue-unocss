import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/** Setup Vue Router */
export async function setupRouter(app: App) {
  app.use(router);
  await router.isReady();
}
