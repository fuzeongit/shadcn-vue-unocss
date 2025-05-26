import type { ProxyOptions } from 'vite';

/**
 * Set http proxy
 *
 * @param env - The current env
 * @param enable - If enable http proxy
 */
export function createViteProxy(env: ImportMetaEnv, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const proxy: Record<string, ProxyOptions> = createProxyItem({
    baseURL: env.VITE_SERVICE_BASE_URL,
    proxyPattern: env.VITE_SERVICE_BASE_PROXY
  });

  return proxy;
}

function createProxyItem(item: Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
  };

  return proxy;
}
