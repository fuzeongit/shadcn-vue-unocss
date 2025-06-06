import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Title of the route
     *
     * It can be used in document title
     */
    title: string;
    /**
     * Is constant route
     *
     * when it is set to true, there will be no login verification and no permission verification to access the route
     */
    constant?: boolean;
    /**
     * Iconify icon
     *
     * It can be used in the menu or breadcrumb
     */
    icon?: string;
    /**
     * Local icon
     *
     * In "src/assets/svg-icon", if it is set, the icon will be ignored
     */
    localIcon?: string;

    order?: number;

    permissions?: PermissionModule.Permission[];

    i18nKey?: App.I18n.I18nKey;
  }
}
