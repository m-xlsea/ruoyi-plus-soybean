<script setup lang="ts">
import { onUnmounted } from 'vue';

import DictTypeList from './type/index.vue';
import DictDataList from './data/index.vue';
import { emitter } from './mitt';

onUnmounted(() => emitter.off('rowClick'));
</script>

<template>
  <div class="h-full flex flex-col md:flex-row gap-16px">
    <DictTypeList class="w-full md:w-1/2" />
    <DictDataList class="w-full md:w-1/2" />
  </div>
</template>

<style scoped></style>
