<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { VueDraggable } from 'vue-draggable-plus';
import { $t } from '@/locales';

defineOptions({
  name: 'TableColumnSetting'
});

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  required: true
});
</script>

<template>
  <NPopover placement="bottom-end" trigger="click">
    <template #trigger>
      <NButton size="small">
        <template #icon>
          <icon-ant-design-setting-outlined class="text-icon" />
        </template>
        {{ $t('common.columnSetting') }}
      </NButton>
    </template>
    <VueDraggable v-model="columns" :animation="150" filter=".none_draggable" class="table-column-setting-list">
      <div
        v-for="item in columns"
        :key="item.key"
        class="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
        :class="{ hidden: !item.visible }"
      >
        <icon-mdi-drag class="mr-8px h-full cursor-move text-icon" />
        <NCheckbox v-model:checked="item.checked" class="none_draggable flex-1">
          <template v-if="typeof item.title === 'function'">
            <component :is="item.title" />
          </template>
          <template v-else>{{ item.title }}</template>
        </NCheckbox>
      </div>
    </VueDraggable>
  </NPopover>
</template>

<style scoped lang="scss">
.table-column-setting-list {
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.table-column-setting-list::-webkit-scrollbar {
  display: none;
}
</style>
