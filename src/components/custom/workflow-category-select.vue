<script setup lang="tsx">
import { computed, useAttrs } from 'vue';
import type { TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetCategoryTree } from '@/service/api/workflow';
import { isNull } from '@/utils/common';

defineOptions({ name: 'WorkflowCategorySelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const rawValue = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.Common.CommonTreeRecord>('options', { required: false, default: [] });

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
  endLoading();
}

getCategoryList();
</script>

<template>
  <NTreeSelect
    v-model:value="strValue"
    filterable
    class="h-full"
    :loading="loading"
    key-field="id"
    label-field="label"
    :options="options as []"
    :default-expanded-keys="[0]"
    v-bind="attrs"
  />
</template>

<style scoped></style>
