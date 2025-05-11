<script setup lang="tsx">
import { onMounted, ref, useAttrs, watch } from 'vue';
import type { TreeSelectInst, TreeSelectProps } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchGetDeptTree } from '@/service/api/system/user';

defineOptions({ name: 'DeptTree' });

interface Props {
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true
});

const { bool: expandAll } = useBoolean();
const { bool: checkAll } = useBoolean();
const expandedKeys = ref<CommonType.IdType[]>([100]);

const deptTreeRef = ref<TreeSelectInst | null>(null);
const value = defineModel<CommonType.IdType[]>('value', { required: false, default: [] });
const options = defineModel<any[]>('options', { required: false, default: [] });
const cascade = defineModel<boolean>('cascade', { required: false, default: true });
const loading = defineModel<boolean>('loading', { required: false, default: false });

const attrs: TreeSelectProps = useAttrs();

async function getDeptList() {
  loading.value = true;
  const { error, data } = await fetchGetDeptTree();
  if (error) return;

  // 确保 options.value 是数组
  if (data) {
    options.value = Array.isArray(data) ? data : [data];
  } else {
    options.value = [];
  }

  loading.value = false;
}

onMounted(() => {
  if (props.immediate) {
    getDeptList();
  }
});

watch([expandAll, options], ([newVal]) => {
  if (newVal) {
    // 展开所有节点
    expandedKeys.value = getAllDeptIds(options.value);
  } else {
    // 折叠到只显示根节点
    expandedKeys.value = [100];
  }
});

function getAllDeptIds(depts: any[]) {
  const deptIds: CommonType.IdType[] = [];
  depts.forEach(item => {
    if (item.id) {
      deptIds.push(item.id);
    }
    if (item.children && Array.isArray(item.children)) {
      deptIds.push(...getAllDeptIds(item.children));
    }
  });
  return deptIds;
}

function handleCheckedTreeNodeAll(checked: boolean) {
  if (checked) {
    value.value = getAllDeptIds(options.value);
    return;
  }
  value.value = [];
}

function handleSubmit() {
  const deptIds = [...value.value];
  const indeterminateData = deptTreeRef.value?.getIndeterminateData();
  if (cascade.value) {
    const parentIds: string[] = indeterminateData?.keys.filter(item => !deptIds?.includes(String(item))) as string[];
    deptIds?.push(...parentIds);
  }
  return deptIds;
}

defineExpose({
  submit: handleSubmit,
  refresh: getDeptList
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
        ref="deptTreeRef"
        v-model:checked-keys="value"
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
        :check-strategy="cascade ? 'child' : 'all'"
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
