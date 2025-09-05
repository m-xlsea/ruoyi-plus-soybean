<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { messageTypeOptions } from '@/constants/workflow';
import { fetchTaskUrge } from '@/service/api/workflow';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'FlowUrgeModal'
});

const { createRequiredRule } = useFormRules();
const { formRef, validate } = useNaiveForm();
interface Props {
  taskIds: CommonType.IdType[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submit'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

type Model = Api.Workflow.TaskUrgeOperateParams;
const model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    taskIdList: props.taskIds,
    messageType: ['1'],
    message: ''
  };
}

type RuleKey = Extract<keyof Model, 'taskIdList' | 'messageType' | 'message'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  taskIdList: createRequiredRule('任务ID不能为空'),
  messageType: createRequiredRule('消息提醒不能为空'),
  message: createRequiredRule('消息内容不能为空')
};

function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    Object.assign(model, createDefaultModel());
  }
});

async function handleSubmit() {
  await validate();
  const { error } = await fetchTaskUrge(model);
  if (error) return;
  window.$message?.success('催办成功');
  closeDrawer();
  emit('submit');
}
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="w-800px" title="催办" :native-scrollbar="false" closable>
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="消息提醒" path="messageType">
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
      <NFormItem label="消息呢用" path="message">
        <NInput v-model:value="model.message" type="textarea" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
