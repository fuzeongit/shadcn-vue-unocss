import type { App } from 'vue';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './_generated/routes';
import { layouts, views } from './_generated/imports';
import { transformToVueRoutes } from './_generated/transformer';

export function createRouterGuard(router: Router) {
  router.beforeEach(async (_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) => {
    next();
  });
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: transformToVueRoutes(routes, layouts, views)
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

export default router;
