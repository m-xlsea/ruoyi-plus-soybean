<script setup lang="ts">
import type { TagProps } from 'naive-ui';
import { useAttrs } from 'vue';
import { enableStatusRecord } from '@/constants/business';
import { isNotNull } from '@/utils/common';

defineOptions({
  name: 'StatusTag'
});

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const status = defineModel<Api.Common.EnableStatus>('value', { required: true });

const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
  '0': 'success',
  '1': 'warning'
};

const attrs: TagProps = useAttrs();
</script>

<template>
  <NTag v-if="isNotNull(status)" :type="tagMap[status]" v-bind="attrs">{{ enableStatusRecord[status] }}</NTag>
</template>

<style scoped></style>
