<script setup lang="tsx">
import { onMounted, ref, useAttrs, watch } from 'vue';
import type { TreeOption, TreeSelectInst, TreeSelectProps } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchGetMenuTreeSelect } from '@/service/api/system';
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
const { bool: checkAll } = useBoolean();
const expandedKeys = ref<CommonType.IdType[]>([0]);

const menuTreeRef = ref<TreeSelectInst | null>(null);
const checkedKeys = defineModel<CommonType.IdType[]>('checkedKeys', { required: false, default: [] });
const options = defineModel<Api.System.MenuList>('options', { required: false, default: [] });
const cascade = defineModel<boolean>('cascade', { required: false, default: true });
const loading = defineModel<boolean>('loading', { required: false, default: false });
const attrs: TreeSelectProps = useAttrs();

async function getMenuList() {
  loading.value = true;
  const { error, data } = await fetchGetMenuTreeSelect();
  if (error) return;
  options.value = [
    {
      id: 0,
      label: '根节点',
      icon: 'material-symbols:home-outline-rounded',
      children: data
    }
  ] as Api.System.MenuList;
  // 折叠到只显示根节点
  loading.value = false;
}

onMounted(() => {
  if (props.immediate) {
    getMenuList();
  }
});

// 添加 watch 监听 expandAll 的变化,options有值后，计算expandedKeys
watch([expandAll, options], ([newVal]) => {
  if (newVal) {
    // 展开所有节点
    expandedKeys.value = getAllMenuIds(options.value);
  } else {
    expandedKeys.value = [0];
  }
});

function renderPrefix({ option }: { option: TreeOption }) {
  const renderLocalIcon = String(option.icon).startsWith('local-icon-');
  let icon = renderLocalIcon ? undefined : String(option.icon ?? 'material-symbols:buttons-alt-outline-rounded');
  const localIcon = renderLocalIcon ? String(option.icon).replace('local-icon-', 'menu-') : undefined;
  if (icon === '#') {
    icon = 'material-symbols:buttons-alt-outline-rounded';
  }
  return <SvgIcon icon={icon} localIcon={localIcon} />;
}

function getAllMenuIds(menu: Api.System.MenuList) {
  const menuIds: CommonType.IdType[] = [];
  menu.forEach(item => {
    menuIds.push(item.id!);
    if (item.children) {
      menuIds.push(...getAllMenuIds(item.children));
    }
  });
  return menuIds;
}

function handleCheckedTreeNodeAll(checked: boolean) {
  if (checked) {
    checkedKeys.value = getAllMenuIds(options.value);
    return;
  }
  checkedKeys.value = [];
}

function getCheckedMenuIds() {
  const menuIds = menuTreeRef.value?.getCheckedData()?.keys as string[];
  const indeterminateData = menuTreeRef.value?.getIndeterminateData();
  if (cascade.value) {
    const parentIds: string[] = indeterminateData?.keys.filter(item => !menuIds?.includes(String(item))) as string[];
    menuIds?.push(...parentIds);
  }
  return menuIds;
}

defineExpose({
  getCheckedMenuIds,
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
        v-model:checked-keys="checkedKeys"
        v-model:expanded-keys="expandedKeys"
        multiple
        checkable
        :selectable="false"
        key-field="id"
        label-field="label"
        :data="options"
        :cascade="cascade"
        :loading="loading"
        virtual-scroll
        check-strategy="all"
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
