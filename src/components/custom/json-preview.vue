<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { computed } from 'vue';

interface Props {
  // 需要展示的json数据
  data: any;
  // 数据深度
  deep?: number;
  // 是否显示双引号
  showDoubleQuotes?: boolean;
  // 是否显示数组/对象的长度
  showLength?: boolean;
  // 是否显示线条
  showLine?: boolean;
  // 是否显示行号
  showLineNumber?: boolean;
  // 是否显示图标
  showIcon?: boolean;
  // 是否显示选择控制器
  showSelectController?: boolean;
  // 默认展开层级
  collapsedLevel?: number;
  // 是否高亮鼠标悬停的节点
  highlightMouseoverNode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  deep: 3,
  showDoubleQuotes: true,
  showLength: false,
  showLine: true,
  showLineNumber: false,
  showIcon: true,
  showSelectController: false,
  collapsedLevel: 1,
  highlightMouseoverNode: false
});

// 计算属性：格式化JSON数据
const jsonData = computed(() => {
  if (!props.data) return null;
  try {
    return typeof props.data === 'string' ? JSON.parse(props.data) : props.data;
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="json-preview">
    <VueJsonPretty
      v-if="jsonData"
      :data="jsonData"
      :deep="deep"
      :show-double-quotes="showDoubleQuotes"
      :show-length="showLength"
      :show-line="showLine"
      :show-line-number="showLineNumber"
      :show-icon="showIcon"
      :show-select-controller="showSelectController"
      :collapsed-level="collapsedLevel"
      :highlight-mouseover-node="highlightMouseoverNode"
    />
    <span v-else-if="props.data">{{ props.data }}</span>
    <div v-else class="empty-data">暂无数据</div>
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
