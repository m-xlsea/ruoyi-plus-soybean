<script setup lang="tsx">
import { computed, useAttrs } from 'vue';
import type { TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetCategoryTree } from '@/service/api/workflow';
import { isNull } from '@/utils/common';

defineOptions({ name: 'FlowCategorySelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const rawValue = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.Common.CommonTreeRecord>('options', { required: false, default: [] });
const expandedKeys = defineModel<CommonType.IdType[]>('expandedKeys', { required: false, default: [] });

const attrs: TreeSelectProps = useAttrs();
const { loading, startLoading, endLoading } = useLoading();

/** 转换为str，id可能是number类型或者String类型，导致回显失败 */
const strValue = computed({
  get() {
    return isNull(rawValue.value) ? null : rawValue.value?.toString();
  },
  set(val) {
    rawValue.value = val;
  }
});

async function getCategoryList() {
  startLoading();
  const { error, data } = await fetchGetCategoryTree();
  if (error) return;
  options.value = data;
  // 设置默认展开的节点
  if (data?.length && !expandedKeys.value.length) {
    expandedKeys.value = [data[0].id];
  }
  endLoading();
}

getCategoryList();
</script>

<template>
  <NTreeSelect
    v-model:value="strValue"
    v-model:expanded-keys="expandedKeys"
    filterable
    class="h-full"
    :loading="loading"
    key-field="id"
    label-field="label"
    :options="options as []"
    v-bind="attrs"
  />
</template>

<style scoped></style>
