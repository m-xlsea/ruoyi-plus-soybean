<script setup lang="ts">
import { computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { twMerge } from 'tailwind-merge';

hljs.registerLanguage('json', json);

defineOptions({
  name: 'JsonPreview'
});

interface Props {
  class?: string;
  code?: string;
  showLineNumbers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  code: '',
  showLineNumbers: false
});

const DEFAULT_CLASS = 'max-h-500px';

/** 格式化JSON数据 */
const jsonData = computed<string>(() => {
  if (!props.code) return '';
  try {
    return typeof props.code === 'string'
      ? JSON.stringify(JSON.parse(props.code), null, '\t')
      : JSON.stringify(props.code, null, '\t');
  } catch {
    return props.code;
  }
});
</script>

<template>
  <NScrollbar :class="twMerge(DEFAULT_CLASS, props.class)">
    <NCode :code="jsonData" :hljs="hljs" language="json" :show-line-numbers="showLineNumbers" :word-wrap="true" />
  </NScrollbar>
</template>

<style lang="scss">
html[class='dark'] {
  .vjs-tree-node:hover {
    background-color: #7c7777;
  }
}
</style>
