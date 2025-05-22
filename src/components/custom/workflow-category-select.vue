<script setup lang="tsx">
import { useAttrs } from 'vue';
import type { TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetCategoryTree } from '@/service/api/workflow';

defineOptions({ name: 'WorkflowCategorySelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const value = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.Common.CommonTreeRecord>('options', { required: false, default: [] });

const attrs: TreeSelectProps = useAttrs();
const { loading, startLoading, endLoading } = useLoading();

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
    v-model:value="value"
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
