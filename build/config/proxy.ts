import type { ProxyOptions } from 'vite';
import { createServiceConfig } from '../../src/utils/service';

/**
 * Set http proxy
 *
 * @param env - The current env
 * @param enable - If enable http proxy
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const { baseURL, proxyPattern, ws, other } = createServiceConfig(env);

  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, ws, proxyPattern });

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item));
  });

  return proxy;
}

function createProxyItem(item: App.Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    ws: item.ws,
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
  };

  return proxy;
}
