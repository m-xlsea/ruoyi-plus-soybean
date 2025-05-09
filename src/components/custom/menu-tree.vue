<script setup lang="tsx">
import { onMounted, ref, useAttrs } from 'vue';
import type { TreeOption, TreeSelectInst, TreeSelectProps } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchGetMenuList } from '@/service/api/system';
import { handleTree } from '@/utils/common';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({ name: 'MenuTree' });

interface Props {
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true
});

const { bool: expandAll } = useBoolean();
const { bool: cascade } = useBoolean(true);
const { bool: checkAll } = useBoolean();

const menuTreeRef = ref<TreeSelectInst | null>(null);
const value = defineModel<CommonType.IdType[]>('value', { required: false, default: [] });
const options = defineModel<Api.System.MenuList>('options', { required: false, default: [] });
const loading = defineModel<boolean>('loading', { required: false, default: false });

const attrs: TreeSelectProps = useAttrs();

async function getMenuList() {
  loading.value = true;
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
  loading.value = false;
}

onMounted(() => {
  if (props.immediate) {
    getMenuList();
  }
});

function renderPrefix({ option }: { option: TreeOption }) {
  const renderLocalIcon = String(option.icon).startsWith('icon-');
  const icon = renderLocalIcon ? undefined : String(option.icon);
  const localIcon = renderLocalIcon ? String(option.icon).replace('icon-', 'menu-') : undefined;
  return <SvgIcon icon={icon} localIcon={localIcon} />;
}

function getAllMenuIds(menu: Api.System.MenuList) {
  const menuIds: CommonType.IdType[] = [];
  menu.forEach(item => {
    menuIds.push(item.menuId);
    if (item.children) {
      menuIds.push(...getAllMenuIds(item.children));
    }
  });
  return menuIds;
}

function handleCheckedTreeNodeAll(checked: boolean) {
  if (checked) {
    value.value = getAllMenuIds(options.value);
    return;
  }
  value.value = [];
}

function handleSubmit() {
  const menuIds = [...value.value];
  const indeterminateData = menuTreeRef.value?.getIndeterminateData();
  if (cascade.value) {
    const parentIds: string[] = indeterminateData?.keys.filter(item => !menuIds?.includes(String(item))) as string[];
    menuIds?.push(...parentIds);
  }
  return menuIds;
}

defineExpose({
  submit: handleSubmit,
  refresh: getMenuList
});
</script>

<template>
  <div class="w-full flex-col gap-12px">
    <div class="w-full flex-center">
      <NCheckbox v-model:checked="expandAll" :checked-value="true" :unchecked-value="false">展开/折叠</NCheckbox>
      <NCheckbox
        v-model:checked="checkAll"
        :checked-value="true"
        :unchecked-value="false"
        @update:checked="handleCheckedTreeNodeAll"
      >
        全选/反选
      </NCheckbox>
      <NCheckbox v-model:checked="cascade" :checked-value="true" :unchecked-value="false">父子联动</NCheckbox>
    </div>
    <NSpin class="resource h-full w-full py-6px pl-3px" content-class="h-full" :show="loading">
      <NTree
        ref="menuTreeRef"
        v-model:checked-keys="value"
        multiple
        checkable
        key-field="menuId"
        label-field="menuName"
        :data="options"
        :cascade="cascade"
        :loading="loading"
        virtual-scroll
        :check-strategy="cascade ? 'child' : 'all'"
        :default-expand-all="expandAll"
        :default-expanded-keys="[0]"
        :render-prefix="renderPrefix"
        v-bind="attrs"
      />
    </NSpin>
  </div>
</template>

<style scoped lang="scss">
.resource {
  border-radius: 6px;
  border: 1px solid rgb(224, 224, 230);

  .n-tree {
    min-height: 200px;
    max-height: 300px;
    width: 100%;
    height: 100%;

    :deep(.n-tree__empty) {
      min-height: 200px;
      justify-content: center;
    }
  }

  .n-empty {
    justify-content: center;
  }
}
</style>
