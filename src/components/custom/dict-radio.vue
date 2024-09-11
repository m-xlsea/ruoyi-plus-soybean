<script setup lang="ts">
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictRadio' });

interface Props {
  dictCode: string;
  immediate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false
});

const value = defineModel<string | null>('value', { required: false });

const { options } = useDict(props.dictCode, props.immediate);
</script>

<template>
  <NRadioGroup v-model:value="value">
    <NSpace>
      <NRadio v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
    </NSpace>
  </NRadioGroup>
</template>

<style scoped></style>
