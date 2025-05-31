<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { messageTypeOptions } from '@/constants/workflow';
import { fetchCompleteTask, fetchGetTask } from '@/service/api/workflow';
import FileUpload from '@/components/custom/file-upload.vue';

defineOptions({
  name: 'WorkflowTaskApplyModal'
});

interface Props {
  /** the task id */
  taskId: CommonType.IdType;
  /** the task variables */
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
const title = defineModel<string>('title', {
  default: '流程发起'
});

const fileUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);

const accept = ref<string>('.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp');

type Model = Api.Workflow.CompleteTaskOperateParams;

const task = ref<Api.Workflow.Task>();

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    taskId: null,
    fileId: null,
    flowCopyList: [],
    messageType: ['1'],
    taskVariables: {},
    variables: {},
    assigneeMap: {}
  };
}

async function getTask() {
  const { error, data } = await fetchGetTask(props.taskId);
  if (error) return;
  task.value = data;
}

async function handleSubmit() {
  const fileList = fileUploadRef.value?.fileList;
  if (fileList?.length) {
    const fileIds = fileList.map(item => item.id);
    model.fileId = fileIds.join(',');
  }
  model.taskId = props.taskId;
  model.taskVariables = props.taskVariables;
  const { error } = await fetchCompleteTask(model);
  if (error) return;
  window.$message?.success('提交成功');
  visible.value = false;
  emit('finished');
}

watch(visible, () => {
  if (visible.value) {
    getTask();
    Object.assign(model, createDefaultModel());
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" :native-scrollbar="false" closable>
    <NForm :model="model">
      <NFormItem label="通知方式" path="messageType">
        <NCheckboxGroup v-model:value="model.messageType">
          <NSpace item-style="display: flex;">
            <NCheckbox v-for="item in messageTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
          </NSpace>
        </NCheckboxGroup>
      </NFormItem>
      <NFormItem label="附件" path="fileId">
        <FileUpload ref="fileUploadRef" :file-size="20" :max="20" upload-type="file" :accept="accept" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NButton @click="visible = false">取消</NButton>
      <NButton type="primary" @click="handleSubmit">提交</NButton>
    </template>
  </NModal>
</template>
