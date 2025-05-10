<script setup lang="tsx">
import { useAttrs } from 'vue';
import type { TreeSelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetDeptSelect } from '@/service/api/system';

defineOptions({ name: 'DeptTreeSelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const value = defineModel<CommonType.IdType | null>('value', { required: false });
const options = defineModel<Api.System.Dept[]>('options', { required: false, default: [] });

const attrs: TreeSelectProps = useAttrs();
const { loading, startLoading, endLoading } = useLoading();

async function getDeptList() {
  startLoading();
  const { error, data } = await fetchGetDeptSelect();
  if (error) return;
  options.value = data;
  endLoading();
}

getDeptList();
</script>

<template>
  <NTreeSelect
    v-model:value="value"
    filterable
    class="h-full"
    :loading="loading"
    key-field="deptId"
    label-field="deptName"
    :options="options"
    :default-expanded-keys="[0]"
    v-bind="attrs"
  />
</template>

<style scoped></style>
