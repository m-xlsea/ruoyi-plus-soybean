<script setup lang="ts">
import { NTooltip } from 'naive-ui';

defineOptions({
  name: 'FormTip'
});

interface Props {
  content: string;
}

defineProps<Props>();
</script>

<template>
  <NTooltip trigger="hover">
    <template #default>
      <span class="whitespace-pre-wrap">{{ content }}</span>
    </template>
    <template #trigger>
      <div class="cursor-pointer pr-3px">
        <SvgIcon class="text-15px" icon="ph:warning-circle-bold" />
      </div>
    </template>
  </NTooltip>
</template>
