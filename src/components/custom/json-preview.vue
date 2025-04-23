<script setup lang="ts">
import { computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

defineOptions({
  name: 'JsonPreview'
});

interface Props {
  code?: string;
  showLineNumbers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  showLineNumbers: false
});

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
  <div class="json-preview">
    <NCode :code="jsonData" :hljs="hljs" language="json" :show-line-numbers="showLineNumbers" />
  </div>
</template>

<style lang="scss">
html[class='dark'] {
  .vjs-tree-node:hover {
    background-color: #7c7777;
  }
}
.json-preview {
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  @include scrollbar();
  .empty-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
    font-size: 14px;
  }
}
</style>
