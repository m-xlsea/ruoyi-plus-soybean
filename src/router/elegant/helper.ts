/* eslint-disable no-console */
/** 后台返回的路由动态生成name 解决缓存问题 感谢 @fourteendp 详见 https://github.com/vbenjs/vue-vben-admin/issues/3927 */
import type { Component } from 'vue';
import { defineComponent, h } from 'vue';

interface Options {
  name?: string;
}

export type RouteComponentLoader = () => Promise<any>;

/**
 * 作用相当于给组件包了一层 & 设置name 解决keepAlive问题
 *
 * @param loader 导入的路由
 * @param options options
 * @returns components
 */
export function createCustomNameComponent(
  loader: RouteComponentLoader,
  options: Options = {}
): () => Promise<Component> {
  const { name } = options;
  let component: Component | null = null;

  const load = async () => {
    try {
      const { default: loadedComponent } = await loader();
      component = loadedComponent;
    } catch (error) {
      console.error(`Cannot resolve component ${name}, error:`, error);
    }
  };

  return async () => {
    if (!component) {
      await load();
    }

    return Promise.resolve(
      defineComponent({
        name,
        render() {
          return h(component as Component);
        }
      })
    );
  };
}
