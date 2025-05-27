interface ImportMetaEnv {
  /** iconify图标作为组件的前缀 */
  readonly VITE_ICON_PREFIX: string;
  /**
   * 本地SVG图标作为组件的前缀, 请注意一定要包含 VITE_ICON_PREFIX
   *
   * - 格式 {VITE_ICON_PREFIX}-{本地图标集合名称}
   * - 例如：icon-local
   */
  readonly VITE_ICON_LOCAL_PREFIX: string;

  readonly VITE_HTTP_PROXY: string;

  readonly VITE_SERVICE_BASE_URL: string;

  readonly VITE_SERVICE_BASE_PROXY: string;
}
