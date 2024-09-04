<script setup lang="tsx">
import { ref, useAttrs } from 'vue';
import { useLoading } from '@sa/hooks';
import type { SelectOption, SelectProps } from 'naive-ui';
import { fetchGetDictTypeOption } from '@/service/api';

defineOptions({ name: 'DictSelect' });

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const value = defineModel<string>('value', { required: true });

const attrs: SelectProps = useAttrs();
const options = ref<SelectOption[]>([]);
const { loading, startLoading, endLoading } = useLoading();

async function getDeptOptions() {
  startLoading();
  const { error, data } = await fetchGetDictTypeOption();
  if (error) return;
  options.value = data.map(dict => ({
    value: dict.dictType!,
    label: () => (
      <div class="w-520px flex justify-between">
        <span>{dict.dictType}</span>
        <span>{dict.dictName}</span>
      </div>
    )
  }));
  endLoading();
}

getDeptOptions();
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="loading"
    :options="options"
    :clear-filter-after-select="false"
    v-bind="attrs"
  />
</template>

<style scoped></style>
