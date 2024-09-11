<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { TagProps } from 'naive-ui';
import { useDict } from '@/hooks/business/dict';

defineOptions({ name: 'DictTag' });

interface Props {
  value: string;
  dictCode: string;
  immediate?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false
});

const attrs: TagProps = useAttrs();
const { transformDictData } = useDict(props.dictCode, props.immediate);
const dictData = computed(() => transformDictData(props.value));
</script>

<template>
  <NTag v-if="dictData" :class="dictData.cssClass" :type="dictData.listClass" v-bind="attrs">
    {{ dictData.dictLabel }}
  </NTag>
</template>

<style scoped></style>
