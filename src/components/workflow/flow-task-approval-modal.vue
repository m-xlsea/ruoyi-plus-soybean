<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { messageTypeOptions } from '@/constants/workflow';
import {
  fetchCompleteTask,
  fetchGetTask,
  fetchGetkNextNode,
  fetchTaskOperate,
  fetchTerminateTask
} from '@/service/api/workflow';
import FileUpload from '@/components/custom/file-upload.vue';
import ReduceSignatureModal from './reduce-signature-modal.vue';
import BackTaskModal from './back-task-modal.vue';

defineOptions({
  name: 'FlowTaskApprovalModal'
});

interface Props {
  /** 任务id */
  taskId: CommonType.IdType;
  /** 任务变量 */
  taskVariables: { [key: string]: any };
}

const props = defineProps<Props>();

interface Emits {
  (e: 'finished'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});
const { loading: baseFormLoading, startLoading: startBaseFormLoading, endLoading: endBaseFormLoading } = useLoading();
const { loading: btnLoading, startLoading: startBtnLoading, endLoading: endBtnLoading } = useLoading();
const { bool: copyVisible, setTrue: openCopyModal } = useBoolean();
const { bool: assigneeVisible, setTrue: openAssigneeModal } = useBoolean();
const { bool: delegateVisible, setTrue: openDelegateModal, setFalse: closeDelegateModal } = useBoolean();
const { bool: transferVisible, setTrue: openTransferModal, setFalse: closeTransferModal } = useBoolean();
const { bool: addSignatureVisible, setTrue: openAddSignatureModal, setFalse: closeAddSignatureModal } = useBoolean();
const { bool: reduceSignatureVisible, setTrue: openReduceSignatureModal } = useBoolean();
const { bool: backVisible, setTrue: openBackModal } = useBoolean();
const title = defineModel<string>('title', {
  default: '流程发起'
});

const accept = ref<string>('.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp');

type Model = Api.Workflow.CompleteTaskOperateParams;

const task = ref<Api.Workflow.Task>();

const isWaiting = computed(() => task.value?.flowStatus === 'waiting');

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    taskId: null,
    fileId: null,
    flowCopyList: [],
    messageType: ['1'],
    taskVariables: null,
    variables: null,
    assigneeMap: null
  };
}
const fileList = ref<UploadFileInfo[]>([]);
// 抄送人
const selectCopyUserList = ref<Api.System.User[]>([]);
// 抄送人id
const selectCopyUserIds = ref<CommonType.IdType[]>([]);
// 下一节点列表
const nestNodeList = ref<Api.Workflow.FlowNode[]>([]);

const nickNameMap = ref<{ [key: string]: string }>({});

const assigneeSearchUserIds = ref<string | null>(null);

const selectAssigneeIds = ref<string[]>([]);

// 节点编码
const nodeCode = ref<string>('');
// 按钮权限
interface ButtonPerm {
  pop: boolean;
  trust: boolean;
  transfer: boolean;
  addSign: boolean;
  subSign: boolean;
  termination: boolean;
  back: boolean;
  copy: boolean;
}
const buttonPerm = reactive<ButtonPerm>(createDefaultButtonPerm());

function createDefaultButtonPerm(): ButtonPerm {
  return {
    pop: false,
    trust: false,
    transfer: false,
    addSign: false,
    subSign: false,
    termination: false,
    back: false,
    copy: false
  };
}

function initDefault() {
  selectCopyUserList.value = [];
  selectCopyUserIds.value = [];
  nickNameMap.value = {};
  assigneeSearchUserIds.value = null;
  selectAssigneeIds.value = [];
  nodeCode.value = '';
  Object.assign(model, createDefaultModel());
  Object.assign(buttonPerm, createDefaultButtonPerm());
}

async function getTask() {
  startBtnLoading();
  startBaseFormLoading();
  const { error, data } = await fetchGetTask(props.taskId);
  if (error) {
    endBtnLoading();
    endBaseFormLoading();
    return;
  }
  task.value = data;
  task.value.buttonList.forEach(item => {
    buttonPerm[item.code as keyof ButtonPerm] = item.show!;
  });
  endBtnLoading();
  const { error: nextNodeError, data: nextNodeData } = await fetchGetkNextNode({
    taskId: props.taskId,
    taskVariables: props.taskVariables
  });
  endBaseFormLoading();
  if (nextNodeError) {
    return;
  }
  nestNodeList.value = nextNodeData;
}

async function handleSubmit() {
  if (buttonPerm.pop && nestNodeList.value?.length) {
    const hasEmptyAssignee = nestNodeList.value.some(e => !model.assigneeMap || !model.assigneeMap[e.nodeCode]);
    if (hasEmptyAssignee) {
      window.$message?.error('请选择审批人！');
      return;
    }
  } else {
    model.assigneeMap = {};
  }
  if (selectCopyUserList.value?.length) {
    model.flowCopyList = selectCopyUserList.value.map(e => ({
      userId: e.userId,
      userName: e.nickName
    }));
  }
  if (fileList.value?.length) {
    const fileIds = fileList.value.map(item => item.id);
    model.fileId = fileIds.join(',');
  }
  model.taskId = props.taskId;
  model.variables = props.taskVariables;
  startBtnLoading();
  startBaseFormLoading();
  try {
    const { error } = await fetchCompleteTask(model);
    if (error) return;
    window.$message?.success('提交成功');
    visible.value = false;
    emit('finished');
  } catch (error) {
    window.$message?.error(`提交失败，请稍后重试,${error}`);
  } finally {
    endBtnLoading();
    endBaseFormLoading();
  }
}

function handleCopyConfirm(userIds: CommonType.IdType[], users?: Api.System.User[]) {
  selectCopyUserList.value = users || [];
  selectCopyUserIds.value = userIds;
}

function handleAssigneeOpen(item: Api.Workflow.FlowNode) {
  if (!item.permissionFlag) {
    window.$message?.error('没有可选人员，请联系管理员！');
    return;
  }
  assigneeSearchUserIds.value = item.permissionFlag;
  nodeCode.value = item.nodeCode;
  selectAssigneeIds.value = model.assigneeMap?.[item.nodeCode]?.split(',') || [];
  openAssigneeModal();
}

function handleAssigneeConfirm(userIds: CommonType.IdType[], users?: Api.System.User[]) {
  // 更新当前节点的审批人
  if (!model.assigneeMap) model.assigneeMap = {};
  model.assigneeMap[nodeCode.value] = userIds.join(',');
  nickNameMap.value[nodeCode.value] = users?.map(item => item.nickName).join(',') || '';
}

function handleCopyTagClose(index?: number) {
  if (index !== undefined) {
    // 删除指定索引的用户
    selectCopyUserIds.value = selectCopyUserIds.value.filter((_, i) => i !== index);
    selectCopyUserList.value = selectCopyUserList.value.filter((_, i) => i !== index);
  } else {
    // 清空所有用户
    selectCopyUserList.value = [];
    selectCopyUserIds.value = [];
    model.flowCopyList = [];
  }
}

function handleAssigneeTagClose(code: string, index?: number) {
  if (!model.assigneeMap?.[code]) return;

  // 获取当前节点的用户ID列表和名称列表
  const userIds = model.assigneeMap[code].split(',');
  const nickNames = nickNameMap.value[code]?.split(',') || [];

  if (index !== undefined) {
    // 删除指定索引的用户
    // 使用filter方式移除指定索引的元素
    const newUserIds = userIds.filter((_, i) => i !== index);
    const newNickNames = nickNames.filter((_, i) => i !== index);

    // 更新数据
    model.assigneeMap[code] = newUserIds.join(',');
    nickNameMap.value[code] = newNickNames.join(',');
  } else {
    // 清空所有用户
    model.assigneeMap[code] = '';
    nickNameMap.value[code] = '';
  }
}

interface TaskOperationOptions {
  userIds: CommonType.IdType[];
  operation: 'delegateTask' | 'transferTask' | 'addSignature';
  confirmText: string;
  successMessage: string;
  closeModal: () => void;
}

function handleTaskOperationConfirm(options: TaskOperationOptions) {
  const { userIds, operation, confirmText, successMessage, closeModal } = options;

  const taskModel = {
    taskId: props.taskId,
    userId: userIds[0],
    message: model.message
  };

  window.$dialog?.warning({
    title: '提示',
    content: `是否确认${confirmText}?`,
    positiveText: `确认${confirmText}`,
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      startBtnLoading();
      startBaseFormLoading();
      const { error } = await fetchTaskOperate(taskModel, operation);
      endBtnLoading();
      endBaseFormLoading();
      if (error) return;
      window.$message?.success(successMessage);
      closeModal();
      visible.value = false;
      emit('finished');
    }
  });
}

// 委托
function handleDelegateConfirm(userIds: CommonType.IdType[]) {
  handleTaskOperationConfirm({
    userIds,
    operation: 'delegateTask',
    confirmText: '委托',
    successMessage: '委托成功',
    closeModal: closeDelegateModal
  });
}

// 转办
function handleTransferConfirm(userIds: CommonType.IdType[]) {
  handleTaskOperationConfirm({
    userIds,
    operation: 'transferTask',
    confirmText: '转办',
    successMessage: '转办成功',
    closeModal: closeTransferModal
  });
}

// 加签
function handleAddSignatureConfirm(userIds: CommonType.IdType[]) {
  handleTaskOperationConfirm({
    userIds,
    operation: 'addSignature',
    confirmText: '加签',
    successMessage: '加签成功',
    closeModal: closeAddSignatureModal
  });
}

// 减签
function handleReduceSubmit() {
  visible.value = false;
  emit('finished');
}

// 终止
function handleTerminate() {
  const terminateModel = {
    taskId: props.taskId,
    comment: model.message
  };
  window.$dialog?.warning({
    title: '提示',
    content: '是否确认终止?',
    positiveText: '确认',
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      startBtnLoading();
      startBaseFormLoading();
      const { error } = await fetchTerminateTask(terminateModel);
      endBtnLoading();
      endBaseFormLoading();
      if (error) return;
      window.$message?.success('终止成功');
      visible.value = false;
      emit('finished');
    }
  });
}

function handleBackSubmit() {
  visible.value = false;
  emit('finished');
}

watch(visible, () => {
  if (visible.value) {
    initDefault();
    getTask();
  }
});
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="w-800px" :title="title" :native-scrollbar="false" closable>
    <NSpin :show="baseFormLoading">
      <NForm :model="model" label-placement="left" :label-width="100">
        <NFormItem label="通知方式" path="messageType">
          <NCheckboxGroup v-model:value="model.messageType">
            <NSpace item-style="display: flex;">
              <NCheckbox
                v-for="item in messageTypeOptions"
                :key="item.value"
                :disabled="item.value === '1'"
                :value="item.value"
                :label="item.label"
              />
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>
        <NFormItem label="附件" path="fileId">
          <FileUpload v-model:file-list="fileList" :file-size="20" :max="20" upload-type="file" :accept="accept" />
        </NFormItem>
        <NFormItem v-if="buttonPerm.copy" label="抄送人员">
          <NSpace>
            <NButton ghost type="primary" @click="openCopyModal">选择抄送人员</NButton>
            <GroupTag
              size="large"
              :value="selectCopyUserList.map(item => item.nickName)"
              :closable="true"
              @close="handleCopyTagClose"
            />
          </NSpace>
        </NFormItem>
        <NFormItem
          v-if="buttonPerm.pop && nestNodeList && nestNodeList.length > 0"
          label="下一步审批人"
          path="assigneeMap"
        >
          <NSpace>
            <div v-for="(item, index) in nestNodeList" :key="index">
              <span>【{{ item.nodeName }}】：</span>
              <NSpace>
                <NButton ghost type="primary" @click="handleAssigneeOpen(item)">选择审批人员</NButton>
                <NInput v-if="false" v-model:value="model.assigneeMap![item.nodeCode]" />
                <GroupTag
                  size="large"
                  :value="nickNameMap[item.nodeCode]"
                  :closable="true"
                  @close="index => handleAssigneeTagClose(item.nodeCode, index)"
                />
              </NSpace>
            </div>
          </NSpace>
        </NFormItem>
        <NFormItem v-if="isWaiting" label="审批意见" path="message">
          <NInput v-model:value="model.message" type="textarea" />
        </NFormItem>
      </NForm>
    </NSpin>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="visible = false">{{ $t('common.cancel') }}</NButton>
        <!-- 委托 -->
        <NButton v-if="isWaiting && buttonPerm.trust" :loading="btnLoading" type="warning" @click="openDelegateModal">
          委托
        </NButton>
        <!-- 转办 -->
        <NButton
          v-if="isWaiting && buttonPerm.transfer"
          :loading="btnLoading"
          type="warning"
          @click="openTransferModal"
        >
          转办
        </NButton>
        <!-- 加签 -->
        <NButton
          v-if="isWaiting && buttonPerm.addSign && Number(task?.nodeRatio) > 0"
          :loading="btnLoading"
          type="warning"
          @click="openAddSignatureModal"
        >
          加签
        </NButton>
        <!-- 减签 -->
        <NButton
          v-if="isWaiting && buttonPerm.subSign && Number(task?.nodeRatio) > 0"
          :loading="btnLoading"
          type="warning"
          @click="openReduceSignatureModal"
        >
          减签
        </NButton>
        <!-- 终止 -->
        <NButton v-if="isWaiting && buttonPerm.termination" :loading="btnLoading" type="error" @click="handleTerminate">
          终止
        </NButton>
        <!-- 驳回 -->
        <NButton v-if="isWaiting && buttonPerm.back" :loading="btnLoading" type="error" @click="openBackModal">
          驳回
        </NButton>
        <NButton :loading="btnLoading" type="primary" @click="handleSubmit">提交</NButton>
      </NSpace>
    </template>
    <!-- 抄送人员选择 -->
    <UserSelectModal
      v-model:visible="copyVisible"
      :row-keys="selectCopyUserIds"
      multiple
      @confirm="handleCopyConfirm"
    />
    <!-- 下一步审批人员选择 -->
    <UserSelectModal
      v-model:visible="assigneeVisible"
      :row-keys="selectAssigneeIds"
      :search-user-ids="assigneeSearchUserIds"
      multiple
      @confirm="handleAssigneeConfirm"
    />
    <!-- 转办 -->
    <UserSelectModal v-model:visible="transferVisible" @confirm="handleTransferConfirm" />
    <!-- 委托 -->
    <UserSelectModal v-model:visible="delegateVisible" @confirm="handleDelegateConfirm" />
    <!-- 加签 -->
    <UserSelectModal v-model:visible="addSignatureVisible" @confirm="handleAddSignatureConfirm" />
    <!-- 减签 -->
    <ReduceSignatureModal v-model:visible="reduceSignatureVisible" :task="task!" @reduce-submit="handleReduceSubmit" />
    <!-- 驳回 -->
    <BackTaskModal v-model:visible="backVisible" :task="task!" @submit="handleBackSubmit" />
  </NModal>
</template>
