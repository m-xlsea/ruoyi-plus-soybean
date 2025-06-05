<script setup lang="ts">
import { useAttrs } from 'vue';
import type { DataTableProps } from 'naive-ui';
import type { CreateRowKey } from 'naive-ui/es/data-table/src/interface';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'DataTable',
  inheritAttrs: false
});

interface Props {
  rowKey?: CreateRowKey<any>;
}

defineProps<Props>();

const { table } = useThemeStore();
const attrs: DataTableProps = useAttrs();
</script>

<template>
  <NDataTable
    :bordered="table.bordered"
    :bottom-bordered="table.bottomBordered"
    :single-column="table.singleColumn"
    :single-line="table.singleLine"
    :size="table.size"
    :striped="table.striped"
    :row-key="rowKey"
    v-bind="attrs"
  />
</template>

<style scoped></style>
