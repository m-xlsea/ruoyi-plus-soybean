<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useBoolean } from '@sa/hooks';
import { fetchTaskOperate, fetchTerminateTask } from '@/service/api/workflow/task';

defineOptions({
  name: 'FlowInterveneModal'
});

const { bool: multiInstanceVisible, setTrue: openMultiInstanceModal } = useBoolean();
const { bool: transferVisible, setTrue: openTransferModal } = useBoolean();
interface Props {
  rowData: Api.Workflow.Task;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const isWaiting = computed(() => props.rowData.flowStatus === 'waiting');

// 流程签署比例值 大于0为票签，会签
const isTicketOrSignInstance = computed(() => Number(props.rowData.nodeRatio) > 0);

const visible = defineModel<boolean>('visible', {
  default: false
});

type Model = Api.Workflow.TaskOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    taskId: null,
    userId: null,
    userIds: null,
    message: ''
  };
}

type TerminateModel = Api.Workflow.TerminateTaskOperateParams;
const terminateModel: TerminateModel = reactive(createDefaultTerminateModel());

function createDefaultTerminateModel(): TerminateModel {
  return {
    taskId: null,
    comment: ''
  };
}

function handleTransferConfirm(ids: CommonType.IdType[]) {
  if (ids.length === 0) {
    window.$message?.error('请选择转办用户');
    return;
  }
  model.userId = ids[0];
  window.$dialog?.warning({
    title: '提示',
    content: '是否确认转办?',
    positiveText: '确认转办',
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchTaskOperate(model, 'transferTask');
      if (error) return;
      window.$message?.success('转办成功');
      visible.value = false;
      emit('refresh');
    }
  });
}

function handleTerminate() {
  window.$dialog?.warning({
    title: '提示',
    content: '是否确认中止?',
    positiveText: '确认',
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchTerminateTask(terminateModel);
      if (error) return;
      window.$message?.success('中止成功');
      visible.value = false;
      emit('refresh');
    }
  });
}

watch(visible, () => {
  if (visible.value) {
    Object.assign(model, createDefaultModel());
    model.taskId = props.rowData.id;
    Object.assign(terminateModel, createDefaultTerminateModel());
    terminateModel.taskId = props.rowData.id;
  }
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
        <NTag type="info" size="small">v{{ props.rowData.version }}.0</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem label="业务ID">
        {{ props.rowData.businessId }}
      </NDescriptionsItem>
    </NDescriptions>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton v-if="isWaiting" type="primary" @click="openTransferModal">转办</NButton>
        <NButton v-if="isWaiting && isTicketOrSignInstance" type="primary" @click="openMultiInstanceModal">
          加签
        </NButton>
        <NButton v-if="isWaiting && isTicketOrSignInstance" type="primary">减签</NButton>
        <NButton v-if="isWaiting" type="error" @click="handleTerminate">中止</NButton>
      </NSpace>
    </template>
    <!-- 转办用户选择器 -->
    <UserSelectModal
      v-model:visible="transferVisible"
      :disabled-ids="props.rowData.assigneeIds.split(',')"
      @confirm="handleTransferConfirm"
    />
    <!-- 加签用户选择器 -->
    <UserSelectModal
      v-model:visible="multiInstanceVisible"
      multiple
      :disabled-ids="props.rowData.assigneeIds.split(',')"
    />
  </NModal>
</template>
