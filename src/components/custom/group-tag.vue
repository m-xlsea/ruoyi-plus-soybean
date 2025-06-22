<script lang="ts" setup>
import { computed } from 'vue';
import { NPopover, NSpace, NTag } from 'naive-ui';

interface Props {
  value: string | any[];
  type?: NaiveUI.ThemeColor;
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  size: 'small',
  placeholder: '无'
});

// 统一解析 value 成数组
const tags = computed(() => {
  if (!props.value) return [];
  return Array.isArray(props.value) ? props.value : props.value.split(',');
});
</script>

<template>
  <template v-if="tags.length === 0">
    <NTag :size="size">
      {{ placeholder }}
    </NTag>
  </template>

  <template v-else-if="tags.length === 1">
    <NTag :type="type" :size="size">
      {{ tags[0] }}
    </NTag>
  </template>

  <template v-else>
    <NPopover trigger="hover" placement="bottom">
      <template #trigger>
        <NTag :type="type" :size="size" class="cursor-pointer">{{ tags[0] }}...({{ tags.length }})</NTag>
      </template>
      <NSpace vertical size="small">
        <NTag v-for="tag in tags" :key="tag" :type="type" :size="size">
          {{ tag }}
        </NTag>
      </NSpace>
    </NPopover>
  </template>
</template>
