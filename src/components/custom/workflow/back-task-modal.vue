<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { messageTypeOptions } from '@/constants/workflow';
import { fetchBackTask, fetchGetBackNode } from '@/service/api/workflow/task';
defineOptions({
  name: 'BackTaskModal'
});

interface Props {
  task: Api.Workflow.Task;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submit'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});
const title = defineModel<string>('title', {
  default: '驳回'
});
const { loading: backFormLoading, startLoading: startBackFormLoading, endLoading: endBackFormLoading } = useLoading();
const { loading: backBtnLoading, startLoading: startBackBtnLoading, endLoading: endBackBtnLoading } = useLoading();

const accept = ref<string>('.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp');

type Model = Api.Workflow.BackOperateParams;

const backModel = reactive(createBackModel());

function createBackModel(): Model {
  return {
    taskId: null,
    fileId: null,
    messageType: ['1'],
    nodeCode: null,
    message: null,
    notice: null,
    variables: null
  };
}
const fileList = ref<UploadFileInfo[]>([]);

const backTaskNodeOptions = ref<CommonType.Option<string, string>[]>([]);

async function initDefault() {
  startBackFormLoading();
  startBackBtnLoading();
  Object.assign(backModel, createBackModel());
  const { error, data } = await fetchGetBackNode(props.task.definitionId, props.task.nodeCode);
  endBackFormLoading();
  endBackBtnLoading();
  if (error) return;
  backTaskNodeOptions.value = data.map(item => ({
    label: item.nodeName,
    value: item.nodeCode
  }));
  backModel.nodeCode = data[0].nodeCode;
}

async function handleSubmit() {
  backModel.taskId = props.task.id;
  if (fileList.value?.length) {
    const fileIds = fileList.value.map(item => item.id);
    backModel.fileId = fileIds.join(',');
  }
  window.$dialog?.warning({
    title: '提示',
    content: `是否确认驳回?`,
    positiveText: `确认驳回`,
    positiveButtonProps: {
      type: 'primary'
    },
    negativeText: '取消',
    onPositiveClick: async () => {
      startBackBtnLoading();
      startBackFormLoading();
      const { error } = await fetchBackTask(backModel);
      endBackBtnLoading();
      endBackFormLoading();
      if (error) return;
      window.$message?.success('驳回成功');
      closeDrawer();
      emit('submit');
    }
  });
}

function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    initDefault();
  }
});
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="w-800px" :title="title" :native-scrollbar="false" closable>
    <NSpin :show="backFormLoading">
      <NForm v-if="task.flowStatus === 'waiting'" :model="backModel">
        <NFormItem label="驳回节点" path="nodeCode">
          <NSelect v-model:value="backModel.nodeCode" :options="backTaskNodeOptions" />
        </NFormItem>
        <NFormItem label="通知方式" path="messageType">
          <NCheckboxGroup v-model:value="backModel.messageType">
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
        <NFormItem label="审批意见" path="message">
          <NInput v-model:value="backModel.message" type="textarea" />
        </NFormItem>
      </NForm>
    </NSpin>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton :loading="backBtnLoading" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
