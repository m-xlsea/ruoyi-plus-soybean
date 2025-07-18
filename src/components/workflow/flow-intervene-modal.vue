<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useBoolean, useLoading } from '@sa/hooks';
import { fetchGetTask, fetchTaskOperate, fetchTerminateTask } from '@/service/api/workflow/task';
import ReduceSignatureModal from './reduce-signature-modal.vue';

defineOptions({
  name: 'FlowInterveneModal'
});

const { loading, startLoading, endLoading } = useLoading();
const { bool: addSignatureVisible, setTrue: openAddSignatureModal } = useBoolean();
const { bool: transferVisible, setTrue: openTransferModal } = useBoolean();
const { bool: reduceSignatureVisible, setTrue: openReduceSignatureModal } = useBoolean();
interface Props {
  taskId: CommonType.IdType;
  assigneeIds: CommonType.IdType[];
  assigneeNames: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const taskInfo = ref<Api.Workflow.Task>();

const isWaiting = computed(() => taskInfo.value?.flowStatus === 'waiting');

// 流程签署比例值 大于0为票签，会签
const isTicketOrSignInstance = computed(() => Number(taskInfo.value?.nodeRatio) > 0);

const visible = defineModel<boolean>('visible', {
  default: false
});

type Model = Api.Workflow.TaskOperateParams;
const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    taskId: null,
    userId: undefined,
    userIds: undefined,
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
  model.userId = ids[0];
  model.taskId = props.taskId;
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

function handleAddSignatureConfirm(ids: CommonType.IdType[]) {
  model.userIds = ids;
  window.$dialog?.warning({
    title: '提示',
    content: '是否确认加签?',
    positiveText: '确认加签',
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchTaskOperate(model, 'addSignature');
      if (error) return;
      window.$message?.success('加签成功');
      visible.value = false;
      emit('refresh');
    }
  });
}

function handleTerminate() {
  terminateModel.taskId = props.taskId;
  window.$dialog?.warning({
    title: '提示',
    content: '是否确认终止?',
    positiveText: '确认',
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchTerminateTask(terminateModel);
      if (error) return;
      window.$message?.success('终止成功');
      visible.value = false;
      emit('refresh');
    }
  });
}

function handleReduceSubmit() {
  visible.value = false;
  emit('refresh');
}

async function getTaskInfo() {
  startLoading();
  const { error, data } = await fetchGetTask(props.taskId);
  if (error) return;
  taskInfo.value = data;
  endLoading();
}

watch(visible, () => {
  if (visible.value) {
    getTaskInfo();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    class="max-h-520px max-w-90% w-700px"
    title="流程干预"
    preset="card"
    size="medium"
    :native-scrollbar="false"
  >
    <NSpin :show="loading">
      <NDescriptions :title="taskInfo?.flowName" label-placement="left" :column="2" size="small" bordered>
        <NDescriptionsItem label="任务名称">
          {{ taskInfo?.nodeName }}
        </NDescriptionsItem>
        <NDescriptionsItem label="节点编码">
          {{ taskInfo?.nodeCode }}
        </NDescriptionsItem>
        <NDescriptionsItem label="开始时间">
          {{ taskInfo?.createTime }}
        </NDescriptionsItem>
        <NDescriptionsItem label="流程实例ID">
          {{ taskInfo?.instanceId }}
        </NDescriptionsItem>
        <NDescriptionsItem label="办理人">
          <GroupTag :value="assigneeNames" />
        </NDescriptionsItem>
        <NDescriptionsItem label="版本号">
          <NTag type="info" size="small">v{{ taskInfo?.version }}.0</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="业务ID">
          {{ taskInfo?.businessId }}
        </NDescriptionsItem>
      </NDescriptions>
    </NSpin>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton v-if="isWaiting" type="primary" @click="openTransferModal">转办</NButton>
        <NButton v-if="isWaiting && isTicketOrSignInstance" type="primary" @click="openAddSignatureModal">加签</NButton>
        <NButton v-if="isWaiting && isTicketOrSignInstance" type="primary" @click="openReduceSignatureModal">
          减签
        </NButton>
        <NButton v-if="isWaiting" type="error" @click="handleTerminate">终止</NButton>
      </NSpace>
    </template>
    <!-- 转办用户选择器 -->
    <UserSelectModal v-model:visible="transferVisible" :disabled-ids="assigneeIds" @confirm="handleTransferConfirm" />
    <!-- 加签用户选择器 -->
    <UserSelectModal
      v-model:visible="addSignatureVisible"
      multiple
      :disabled-ids="assigneeIds"
      @confirm="handleAddSignatureConfirm"
    />
    <!-- 减签用户 -->
    <ReduceSignatureModal
      v-model:visible="reduceSignatureVisible"
      :task="taskInfo!"
      @reduce-submit="handleReduceSubmit"
    />
  </NModal>
</template>
