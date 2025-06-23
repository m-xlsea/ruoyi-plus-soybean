<script lang="ts" setup>
defineOptions({
  name: 'FlowInterveneModal'
});

interface Props {
  rowData: Api.Workflow.TaskOrHisTask;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});
</script>

<template>
  <NModal v-model:show="visible" class="max-h-520px max-w-90% w-700px" title="流程干预" preset="card" size="medium">
    <NDescriptions label-placement="left" :column="2" size="small" bordered>
      <NDescriptionsItem label="任务名称">
        {{ props.rowData.nodeName }}
      </NDescriptionsItem>
      <NDescriptionsItem label="节点编码">
        {{ props.rowData.nodeCode }}
      </NDescriptionsItem>
      <NDescriptionsItem label="开始时间">
        {{ props.rowData.createTime }}
      </NDescriptionsItem>
      <NDescriptionsItem label="流程实例ID">
        {{ props.rowData.instanceId }}
      </NDescriptionsItem>
      <NDescriptionsItem label="版本号">
        {{ props.rowData.version }}
      </NDescriptionsItem>
      <NDescriptionsItem label="业务ID">
        {{ props.rowData.businessId }}
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
</template>
