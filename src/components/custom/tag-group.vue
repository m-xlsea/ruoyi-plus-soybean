<script lang="ts" setup>
import { computed } from 'vue';
import { NPopover, NSpace, NTag } from 'naive-ui';

interface Props {
  value: string | any[];
  type?: NaiveUI.ThemeColor;
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
  closable?: boolean;
  threadshold?: number; // 超过该数量显示popover
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  size: 'small',
  placeholder: '无',
  closable: false,
  threadshold: 1 // 默认超过1个就显示popover
});

interface Emits {
  (e: 'close', index?: number): void;
}

const emit = defineEmits<Emits>();

// 统一解析 value 成数组
const tags = computed(() => {
  if (!props.value) return [];
  return Array.isArray(props.value) ? props.value : props.value.split(',');
});

function handleClose(index?: number) {
  emit('close', index);
}
</script>

<template>
  <template v-if="tags.length === 0">
    <NTag :size="size">
      {{ placeholder }}
    </NTag>
  </template>

  <template v-else-if="tags.length <= threadshold">
    <NTag
      v-for="(tag, index) in tags"
      :key="index"
      :type="type"
      class="m-1"
      :size="size"
      :closable="closable"
      @close="handleClose(index)"
    >
      {{ tag }}
    </NTag>
  </template>

  <template v-else>
    <NPopover trigger="hover" placement="bottom">
      <template #trigger>
        <NTag :type="type" :size="size" class="cursor-pointer">{{ tags[0] }}...({{ tags.length }})</NTag>
      </template>
      <NSpace vertical size="small">
        <NTag
          v-for="(tag, index) in tags"
          :key="index"
          :type="type"
          :size="size"
          :closable="closable"
          @close="handleClose(index)"
        >
          {{ tag }}
        </NTag>
      </NSpace>
    </NPopover>
  </template>
</template>
