<script setup lang="ts">
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictCheckbox' });

interface Props {
  dictCode: string;
  immediate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false
});

const value = defineModel<string[]>('value', { required: false });

const { options } = useDict(props.dictCode, props.immediate);
</script>

<template>
  <NCheckboxGroup v-model:value="value">
    <NSpace>
      <NCheckbox v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
    </NSpace>
  </NCheckboxGroup>
</template>

<style scoped></style>
