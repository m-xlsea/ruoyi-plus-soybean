<script lang="ts" setup>
import { useBoolean, useLoading } from '~/packages/hooks/src';

defineOptions({
  name: 'FlowInterveneModal'
});

const { bool: multiInstanceVisible, setTrue: openMultiInstanceModal } = useBoolean();
const { bool: transferVisible, setTrue: openTransferModal } = useBoolean();
interface Props {
  rowData: Api.Workflow.Task;
}
const { loading: btnLoading } = useLoading();
const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});
</script>

<template>
  <NModal v-model:show="visible" class="max-h-520px max-w-90% w-700px" title="流程干预" preset="card" size="medium">
    <NDescriptions :title="props.rowData.flowName" label-placement="left" :column="2" size="small" bordered>
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
      <NDescriptionsItem label="办理人">
        <GroupTag :value="props.rowData.assigneeNames" />
      </NDescriptionsItem>
      <NDescriptionsItem label="版本号">
        {{ props.rowData.version }}
      </NDescriptionsItem>
      <NDescriptionsItem label="业务ID">
        {{ props.rowData.businessId }}
      </NDescriptionsItem>
    </NDescriptions>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton :disabled="btnLoading" type="primary" @click="openTransferModal">转办</NButton>
        <NButton :disabled="btnLoading" type="primary" @click="openMultiInstanceModal">加签</NButton>
        <NButton :disabled="btnLoading" type="primary">减签</NButton>
        <NButton :disabled="btnLoading" type="error">中止</NButton>
      </NSpace>
    </template>
    <!-- 加签用户选择器 -->
    <UserSelectModal
      v-model:visible="multiInstanceVisible"
      multiple
      :disabled-ids="props.rowData.assigneeIds.split(',')"
    />
    <!-- 转办用户选择器 -->
    <UserSelectModal v-model:visible="transferVisible" :disabled-ids="props.rowData.assigneeIds.split(',')" />
  </NModal>
</template>
