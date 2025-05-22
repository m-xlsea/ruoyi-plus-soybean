<script setup lang="ts">
import { ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { getToken } from '@/store/modules/auth/shared';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { getServiceBaseURL } from '@/utils/service';
import type FileUpload from '@/components/custom/file-upload.vue';
import { $t } from '@/locales';

defineOptions({
  name: 'DefinitionImportModal'
});

interface Emits {
  (e: 'submitted'): void;
}

const { baseURL } = getServiceBaseURL(import.meta.env);

const headers: Record<string, string> = {
  Authorization: `Bearer ${getToken()}`,
  clientid: import.meta.env.VITE_APP_CLIENT_ID!
};

const emit = defineEmits<Emits>();

const uploadRef = ref<typeof FileUpload>();
const message = ref<string>('');
const success = ref<boolean>(false);

const visible = defineModel<boolean>('visible', {
  default: false
});

const data = ref<Record<string, any>>({
  category: undefined
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const rules: Record<string, App.Global.FormRule> = {
  category: createRequiredRule('流程分类不能为空')
};

const fileList = ref<UploadFileInfo[]>([]);

function closeDrawer() {
  visible.value = false;
  if (success.value) {
    emit('submitted');
  }
}

async function handleSubmit() {
  await validate();
  if (fileList.value.length === 0) {
    window.$message?.error('请选择流程文件');
    return;
  }
  fileList.value.forEach(item => {
    item.status = 'pending';
  });
  uploadRef.value?.submit();
  visible.value = false;
}

function isErrorState(xhr: XMLHttpRequest) {
  const responseText = xhr?.responseText;
  const response = JSON.parse(responseText);
  return response.code !== 200;
}

function handleFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  const { file, event } = options;
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText;
  const response = JSON.parse(responseText);
  message.value = response.msg;
  window.$message?.success($t('common.importSuccess'));
  success.value = true;
  return file;
}

function handleError(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  const { event } = options;
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText;
  const msg = JSON.parse(responseText).msg;
  message.value = msg;
  window.$message?.error(msg || $t('common.importFail'));
  success.value = false;
}

watch(visible, () => {
  if (visible.value) {
    fileList.value = [];
    success.value = false;
    message.value = '';
    restoreValidation();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    title="部署流程文件"
    preset="card"
    :bordered="false"
    display-directive="show"
    class="max-w-90% w-600px"
    @close="closeDrawer"
  >
    <NForm ref="formRef" label-placement="left" :model="data" :rules="rules">
      <NFormItem label="流程分类" path="category">
        <WorkflowCategorySelect v-model:value="data.category" />
      </NFormItem>
    </NForm>

    <NUpload
      ref="uploadRef"
      v-model:file-list="fileList"
      class="mt-12px"
      :action="`${baseURL}/workflow/definition/importDef`"
      :headers="headers"
      :data="data"
      :max="1"
      :file-size="50"
      accept=".json"
      :multiple="false"
      directory-dnd
      :default-upload="false"
      list-type="text"
      :is-error-state="isErrorState"
      @finish="handleFinish"
      @error="handleError"
    >
      <NUploadDragger>
        <div class="mb-12px flex-center">
          <SvgIcon icon="material-symbols:unarchive-outline" class="text-58px color-#d8d8db dark:color-#a1a1a2" />
        </div>
        <NText class="text-16px">请选择 JSON 流程文件上传</NText>
        <NP depth="3" class="mt-8px text-center">
          仅支持 JSON 格式文件
          <br />
          PS: 如若部署请部署从本项目模型管理导出的数据
        </NP>
      </NUploadDragger>
    </NUpload>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton type="primary" @click="handleSubmit">{{ $t('common.import') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
