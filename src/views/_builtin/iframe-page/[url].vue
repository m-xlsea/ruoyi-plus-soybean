<script setup lang="ts">
import { onActivated, onMounted } from 'vue';

interface Props {
  url: string;
}

defineProps<Props>();

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('mounted');
});

onActivated(() => {
  // eslint-disable-next-line no-console
  console.log('activated');
});
</script>

<template>
  <div class="h-full">
    <iframe id="iframePage" class="size-full" :src="url"></iframe>
  </div>
</template>

<style scoped></style>
