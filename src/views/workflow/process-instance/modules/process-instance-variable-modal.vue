<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetInstanceVariable, fetchUpdateInstanceVariable } from '@/service/api/workflow/instance';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import JsonPreview from '@/components/custom/json-preview.vue';
import { $t } from '@/locales';

defineOptions({
  name: 'InstanceVariableModal'
});

interface Props {
  instanceId: CommonType.IdType;
}
const props = defineProps<Props>();

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();
const { loading: updateLoading, startLoading: startUpdateLoading, endLoading: endUpdateLoading } = useLoading();

const visible = defineModel<boolean>('visible', {
  default: false
});

const variableOptions = ref<CommonType.Option<string>[]>([]);

const instanceVariableInfo = ref<Api.Workflow.InstanceVariableInfo>();

type Model = Api.Workflow.InstanceVariableOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    instanceId: props.instanceId,
    key: null,
    value: ''
  };
}

type RuleKey = Extract<keyof Model, 'key' | 'value'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  key: createRequiredRule('变量KEY不能为空'),
  value: createRequiredRule('变量值不能为空')
};

function closeDrawer() {
  visible.value = false;
}

async function getInstanceVariable() {
  startUpdateLoading();
  const { error, data } = await fetchGetInstanceVariable(props.instanceId);
  if (error) return;
  instanceVariableInfo.value = data;
  if (data.variableList) {
    variableOptions.value = data.variableList.map(item => ({
      label: item.key!,
      value: item.key!
    }));
  }
  endUpdateLoading();
}

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();
}

async function handleSubmit() {
  await validate();
  // request
  const { error } = await fetchUpdateInstanceVariable(model.value);
  if (error) return;
  window.$message?.success($t('common.updateSuccess'));
  await getInstanceVariable();
}

watch(visible, () => {
  if (visible.value) {
    getInstanceVariable();
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
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
    <NSpin :show="updateLoading">
      <NSpace vertical :size="16">
        <div class="max-h-300px overflow-auto">
          <JsonPreview :code="instanceVariableInfo?.variable as string" />
        </div>
        <NDivider>变量管理</NDivider>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:12" label="变量KEY" path="key" class="pr-24px">
              <NSelect v-model:value="model.key" clearable :options="variableOptions" placeholder="请选择变量KEY" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12" label="变量值" path="value" class="pr-24px">
              <NInput v-model:value="model.value" placeholder="请输入变量值" />
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NSpace>
    </NSpin>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
