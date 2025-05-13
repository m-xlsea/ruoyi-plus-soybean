import { resolve } from 'node:path';
import type { PluginOption } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/** 配置静态资源复制 */
export function setupCopyPlugin(): PluginOption {
  return viteStaticCopy({
    targets: [
      {
        src: `${resolve('packages/tinymce/dist')}/*`,
        dest: 'assets'
      }
    ]
  });
}
