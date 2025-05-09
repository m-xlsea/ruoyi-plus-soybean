<script setup lang="tsx">
import { useAttrs } from 'vue';
import type { TreeOption, TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetMenuList } from '@/service/api/system';
import { handleTree } from '@/utils/common';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({ name: 'MenuTreeSelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const value = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.System.MenuList>('options', { required: false, default: [] });

const attrs: TreeSelectProps = useAttrs();
const { loading, startLoading, endLoading } = useLoading();

async function getMenuList() {
  startLoading();
  const { error, data } = await fetchGetMenuList();
  if (error) return;
  options.value = [
    {
      menuId: 0,
      menuName: '根目录',
      icon: 'material-symbols:home-outline-rounded',
      children: handleTree(data, { idField: 'menuId', filterFn: item => item.menuType !== 'F' })
    }
  ] as Api.System.MenuList;
  endLoading();
}

getMenuList();

function renderPrefix({ option }: { option: TreeOption }) {
  const renderLocalIcon = String(option.icon).startsWith('icon-');
  const icon = renderLocalIcon ? undefined : String(option.icon);
  const localIcon = renderLocalIcon ? String(option.icon).replace('icon-', 'menu-') : undefined;
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
    :render-prefix="renderPrefix"
    v-bind="attrs"
  />
</template>

<style scoped></style>
