<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { TagProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictTag' });

interface Props {
  value?: string;
  dictCode?: string;
  immediate?: boolean;
  dictData?: Api.System.DictData;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false,
  dictData: undefined,
  dictCode: '',
  value: ''
});

const attrs = useAttrs() as TagProps;

const dictTagData = computed(() => {
  if (props.dictData) {
    return props.dictData;
  }

  if (props.dictCode && props.value) {
    const { transformDictData } = useDict(props.dictCode, props.immediate);
    return transformDictData(props.value);
  }

  return null;
});
</script>

<template>
  <NTag v-if="dictTagData" :class="dictTagData.cssClass" :type="dictTagData.listClass" v-bind="attrs">
    {{ dictTagData.dictLabel }}
  </NTag>
</template>

<style scoped></style>
