import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useContext } from '@sa/hooks';
import { useRouteStore } from '@/store/modules/route';

export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu);

function useMixMenu() {
  const route = useRoute();
  const routeStore = useRouteStore();
  const { selectedKey } = useMenu();

  const activeFirstLevelMenuKey = ref('');

  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key;
  }

  const allMenus = computed<App.Global.Menu[]>(() => routeStore.menus);

  function getActiveFirstLevelMenuKey() {
    const currentKey = selectedKey.value;

    const firstLevelMenu = allMenus.value.find(menu => {
      if (menu.key === currentKey) {
        return true;
      }

      if (menu.children && menu.children.length > 0) {
        return findMenuByKey(menu.children, currentKey);
      }

      return false;
    });

    if (firstLevelMenu) {
      setActiveFirstLevelMenuKey(firstLevelMenu.key);
    } else {
      const [firstLevelRouteName] = currentKey.split('_');
      setActiveFirstLevelMenuKey(firstLevelRouteName);
    }
  }

  function findMenuByKey(menus: App.Global.Menu[], key: string): boolean {
    return menus.some(menu => {
      if (menu.key === key) {
        return true;
      }

      if (menu.children && menu.children.length > 0) {
        return findMenuByKey(menu.children, key);
      }

      return false;
    });
  }

  const firstLevelMenus = computed<App.Global.Menu[]>(() =>
    routeStore.menus.map(menu => {
      const { children: _, ...rest } = menu;

      return rest;
    })
  );

  const childLevelMenus = computed<App.Global.Menu[]>(
    () => routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || []
  );

  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false;
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey();
    },
    { immediate: true }
  );

  return {
    allMenus,
    firstLevelMenus,
    childLevelMenus,
    isActiveFirstLevelMenuHasChildren,
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    getActiveFirstLevelMenuKey
  };
}

export function useMenu() {
  const route = useRoute();

  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta;
    const name = route.name as string;

    const routeName = (hideInMenu ? activeMenu : name) || name;

    return routeName;
  });

  return {
    selectedKey
  };
}
