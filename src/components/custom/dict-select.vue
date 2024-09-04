<script setup lang="tsx">
import { ref, useAttrs, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import type { SelectProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictSelect' });

const dictType = defineModel<string>('value', { required: true });

const attrs: SelectProps = useAttrs();
const { getDictOptions } = useDict();
const options = ref<Array<CommonType.Option>>([]);
const { loading, startLoading, endLoading } = useLoading();

async function getDeptOptions() {
  if (!dictType.value) {
    return;
  }
  startLoading();
  const dictData = await getDictOptions(dictType.value);
  options.value = dictData[dictType.value];
  endLoading();
}

watch(
  () => dictType.value,
  () => {
    getDeptOptions();
  },
  { immediate: true }
);
</script>

<template>
  <NSelect :loading="loading" :options="options" :clear-filter-after-select="false" v-bind="attrs" />
</template>

<style scoped></style>
