<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { definitionDesignerModeOptions } from '@/constants/workflow';
import { fetchCreateDefinition, fetchUpdateDefinition } from '@/service/api/workflow/definition';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useDict } from '@/hooks/business/dict';
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

useDict('sys_yes_no');
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
  const value = key.replace('/src/components/workflow/form', '/workflow').replace('.vue', '');
  formPaths.value.push({ label, value });
});

type Model = Api.Workflow.DefinitionOperateParams;

const model = ref<Model>(createDefaultModel());

/** 是否自动通过 */
const autoPass = ref<boolean>(false);

function createDefaultModel(): Model {
  return {
    flowCode: '',
    flowName: '',
    category: '',
    formPath: null,
    formCustom: 'N',
    modelValue: 'CLASSICS',
    ext: ''
  };
}

type RuleKey = Extract<keyof Model, 'flowCode' | 'flowName' | 'category' | 'modelValue' | 'formCustom'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  flowCode: createRequiredRule('流程编码不能为空'),
  flowName: createRequiredRule('流程名称不能为空'),
  category: createRequiredRule('流程类别不能为空'),
  modelValue: createRequiredRule('设计器模式不能为空'),
  formCustom: createRequiredRule('审批表单是否自定义不能为空')
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();

  if (props.operateType === 'add') {
    model.value.formCustom = 'N';
    autoPass.value = false;
    // 设置默认的 ext JSON
    model.value.ext = JSON.stringify({ autoPass: false });
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
    // 从 ext 字段解析 JSON 并设置 autoPass 值
    try {
      if (props.rowData.ext) {
        const extData = JSON.parse(props.rowData.ext);
        autoPass.value = extData.autoPass || false;
      } else {
        autoPass.value = false;
      }
    } catch {
      // 如果解析失败，设置默认值
      autoPass.value = false;
    }
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  // 将 autoPass 值序列化为 JSON 并存储到 ext 字段
  model.value.ext = JSON.stringify({ autoPass: autoPass.value });

  const { id, flowCode, flowName, category, formPath, modelValue, formCustom, ext } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateDefinition({
      flowCode,
      flowName,
      category,
      formPath: formPath || '',
      modelValue,
      formCustom,
      ext
    });
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateDefinition({
      id,
      flowCode,
      flowName,
      category,
      formPath: formPath || '',
      modelValue,
      formCustom,
      ext
    });
    if (error) return;
    window.$message?.success($t('common.updateSuccess'));
  }

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
        <NFormItem label="设计器模式" path="modelValue">
          <NRadioGroup v-model:value="model.modelValue" :disabled="operateType === 'edit'">
            <NSpace>
              <NRadioButton
                v-for="option in definitionDesignerModeOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <!-- 流程配置 -->
        <NFormItem label="流程配置" path="ext">
          <NCheckbox v-model:checked="autoPass" label="下一节点执行人是当前任务处理人自动审批" />
        </NFormItem>
        <NFormItem label="是否动态表单" path="formCustom">
          <DictRadio v-model:value="model.formCustom" dict-code="sys_yes_no" />
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
