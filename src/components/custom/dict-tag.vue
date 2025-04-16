<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { TagProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';
import { isNotNull } from '@/utils/common';

defineOptions({ name: 'DictTag' });

interface Props {
  value?: string | number;
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
  // 避免 props.value 为 0 时，无法触发
  if (props.dictCode && isNotNull(props.value)) {
    const { transformDictData } = useDict(props.dictCode, props.immediate);
    return transformDictData(String(props.value));
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
