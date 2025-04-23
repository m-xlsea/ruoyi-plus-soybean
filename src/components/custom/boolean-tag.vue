<script setup lang="ts">
import { useAttrs } from 'vue';
import type { TagProps } from 'naive-ui';
import { isNotNull } from '@/utils/common';

defineOptions({
  name: 'BooleanTag'
});

const value = defineModel<'0' | '1'>('value', { required: true });

const tagMap: Record<'0' | '1', NaiveUI.ThemeColor> = {
  0: 'success',
  1: 'error'
};

const attrs: TagProps = useAttrs();
</script>

<template>
  <NTag v-if="isNotNull(value)" :type="tagMap[value]" v-bind="attrs">{{ value === '0' ? '是' : '否' }}</NTag>
</template>

<style scoped></style>
