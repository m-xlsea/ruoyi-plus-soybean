<script setup lang="ts">
import JsonPreview from '@/components/custom/json-preview.vue';

defineOptions({
  name: 'ProcessInstanceVariableDrawer'
});

interface Props {
  rowData: Api.Workflow.ProcessInstance | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeDrawer() {
  visible.value = false;
}
</script>

<template>
  <NModal
    v-model:show="visible"
    title="流程变量"
    preset="card"
    :bordered="false"
    display-directive="show"
    class="max-w-90% w-600px"
    @close="closeDrawer"
  >
    <JsonPreview :code="props.rowData?.variable"></JsonPreview>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
