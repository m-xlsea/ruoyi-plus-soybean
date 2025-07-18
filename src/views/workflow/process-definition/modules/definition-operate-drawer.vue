<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { fetchCreateDefinition, fetchUpdateDefinition } from '@/service/api/workflow/definition';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'DefinitionOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Workflow.Definition | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增流程定义',
    edit: '编辑流程定义'
  };
  return titles[props.operateType];
});

const formPaths = ref<SelectOption[]>([]);
const modules = import.meta.glob('@/components/workflow/form/**/*.vue');
Object.keys(modules).forEach(key => {
  const label = key.replace('/src/components/workflow/form/', '');
  const value = key.replace('/src/components/workflow/form', '/workflow');
  formPaths.value.push({ label, value });
});

type Model = Api.Workflow.DefinitionOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    flowCode: '',
    flowName: '',
    category: '',
    formPath: undefined
  };
}

type RuleKey = Extract<keyof Model, 'flowCode' | 'flowName' | 'category'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  flowCode: createRequiredRule('流程编码不能为空'),
  flowName: createRequiredRule('流程名称不能为空'),
  category: createRequiredRule('流程类别不能为空')
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  // request
  if (props.operateType === 'add') {
    const { flowCode, flowName, category, formPath } = model;
    const { error } = await fetchCreateDefinition({ flowCode, flowName, category, formPath });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { id, flowCode, flowName, category, formPath } = model;
    const { error } = await fetchUpdateDefinition({ id, flowCode, flowName, category, formPath });
    if (error) return;
  }

  window.$message?.success($t('common.saveSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="流程类别" path="category">
          <FlowCategorySelect v-model:value="model.category" placeholder="请选择流程类别" />
        </NFormItem>
        <NFormItem label="流程编码" path="flowCode">
          <NInput v-model:value="model.flowCode" placeholder="请输入流程编码" />
        </NFormItem>
        <NFormItem label="流程名称" path="flowName">
          <NInput v-model:value="model.flowName" placeholder="请输入流程名称" />
        </NFormItem>
        <NFormItem label="审批表单路径" path="formPath">
          <template #label>
            <div class="flex-center">
              <FormTip content="需要在 /src/components/workflow/form 路径下创建组件" />
              <span class="pl-3px">审批表单路径</span>
            </div>
          </template>
          <NSelect v-model:value="model.formPath" :options="formPaths" placeholder="请选择审批表单路径" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
