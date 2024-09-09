<script setup lang="ts">
import { useAttrs } from 'vue';
import type { SelectProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictSelect' });

interface Props {
  dictCode: string;
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true
});

const value = defineModel<string | null>('value', { required: true });

const attrs: SelectProps = useAttrs();
const { options } = useDict(props.dictCode, props.immediate);
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="!options.length"
    :options="options"
    :clear-filter-after-select="false"
    v-bind="attrs"
  />
</template>

<style scoped></style>
