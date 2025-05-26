import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Title of the route
     *
     * It can be used in document title
     */
    title: string;
  }
}
