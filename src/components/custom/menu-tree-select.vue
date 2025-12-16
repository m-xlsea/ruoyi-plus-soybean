<script setup lang="tsx">
import { onMounted, useAttrs } from 'vue';
import type { TreeOption, TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetMenuList } from '@/service/api/system';
import { handleTree } from '@/utils/common';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';

defineOptions({ name: 'MenuTreeSelect' });

interface Props {
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true
});

const value = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.System.MenuList>('options', { required: false, default: [] });

const attrs: TreeSelectProps = useAttrs();
const { loading, startLoading, endLoading } = useLoading();

async function getMenuList() {
  startLoading();
  const { error, data } = await fetchGetMenuList();
  if (error) return;
  const { tree } = handleTree(data, { idField: 'menuId', filterFn: item => item.menuType !== 'F' });
  options.value = [
    {
      menuId: 0,
      menuName: '根目录',
      icon: 'material-symbols:home-outline-rounded',
      children: tree
    }
  ] as Api.System.MenuList;
  endLoading();
}

onMounted(() => {
  if (props.immediate) {
    getMenuList();
  }
});

function renderLabel({ option }: { option: TreeOption }) {
  let label = String(option.menuName);
  if (label?.startsWith('route.') || label?.startsWith('menu.')) {
    label = $t(label as App.I18n.I18nKey);
  }
  return <div>{label}</div>;
}

function renderPrefix({ option }: { option: TreeOption }) {
  const renderLocalIcon = String(option.icon).startsWith('local-icon-');
  const icon = renderLocalIcon ? undefined : String(option.icon);
  const localIcon = renderLocalIcon ? String(option.icon).replace('local-icon-', 'menu-') : undefined;
  return <SvgIcon icon={icon} localIcon={localIcon} />;
}
</script>

<template>
  <NTreeSelect
    v-model:value="value"
    filterable
    class="h-full"
    :loading="loading"
    key-field="menuId"
    label-field="menuName"
    :options="options"
    :default-expanded-keys="[0]"
    :render-tag="renderLabel"
    :render-label="renderLabel"
    :render-prefix="renderPrefix"
    v-bind="attrs"
  />
</template>

<style scoped></style>
