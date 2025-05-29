import type { CustomRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { getRouteName, transformElegantRoutesToVueRoutes } from '../elegant/transform';

const customRoutes: CustomRoute[] = [
  {
    name: 'root',
    path: '/',
    redirect: {
      name: getRouteName(import.meta.env.VITE_ROUTE_HOME) || 'home'
    }
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: 'layout.blank$view.404'
  }
];

const elegantRoutes: ElegantRoute[] = [...customRoutes, ...generatedRoutes];

export const routes = transformElegantRoutesToVueRoutes(elegantRoutes, layouts, views);
