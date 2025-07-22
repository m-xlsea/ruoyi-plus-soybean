<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { fetchCreateSpel, fetchUpdateSpel } from '@/service/api/workflow/spel';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';

defineOptions({
  name: 'SpelOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Workflow.Spel | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { options: sysNormalDisableOptions } = useDict('sys_normal_disable');

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增流程表达式',
    edit: '编辑流程表达式'
  };
  return titles[props.operateType];
});

// 参数标签
const methodParamTags = ref<string[]>([]);

type Model = Api.Workflow.SpelOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    componentName: '',
    methodName: '',
    methodParams: '',
    viewSpel: '',
    remark: '',
    status: ''
  };
}

type RuleKey = Extract<keyof Model, 'id'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule('主键id不能为空')
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    methodParamTags.value = [];
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
    // 如果有参数，将逗号分隔的字符串转为数组
    methodParamTags.value = model.methodParams ? model.methodParams.split(',') : [];
  }
}

// 实时更新 SPEL 表达式
function updateSpelExpression() {
  if (!model.componentName || !model.methodName) {
    model.viewSpel = '';
    return;
  }

  // 构建参数部分
  const params = methodParamTags.value.map(param => `#${param}`).join(',');

  // 生成 SPEL 表达式: #{@组件名.方法名(#参数1,#参数2,...)}
  model.viewSpel = `#{@${model.componentName}.${model.methodName}(${params})}`;
}

// 监听组件名、方法名和参数变化
watch(() => model.componentName, updateSpelExpression);
watch(() => model.methodName, updateSpelExpression);
watch(methodParamTags, updateSpelExpression, { deep: true });

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  // 将参数标签数组转为逗号分隔的字符串
  model.methodParams = methodParamTags.value.join(',');

  const { id, componentName, methodName, methodParams, viewSpel, remark, status } = model;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateSpel({ componentName, methodName, methodParams, viewSpel, remark, status });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateSpel({ id, componentName, methodName, methodParams, viewSpel, remark, status });
    if (error) return;
  }

  window.$message?.success($t('common.updateSuccess'));
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
        <NFormItem label="组件名称" path="componentName">
          <NInput v-model:value="model.componentName" placeholder="请输入组件名称" />
        </NFormItem>
        <NFormItem label="方法名" path="methodName">
          <NInput v-model:value="model.methodName" placeholder="请输入方法名" />
        </NFormItem>
        <NFormItem label="参数" path="methodParams">
          <NDynamicTags v-model:value="methodParamTags" placeholder="请输入参数后回车" />
        </NFormItem>
        <NFormItem label="spel表达式" path="viewSpel">
          <NInput v-model:value="model.viewSpel" placeholder="自动生成的spel表达式" disabled />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" placeholder="请输入备注" />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NRadioGroup v-model:value="model.status">
            <NSpace>
              <NRadio
                v-for="option in sysNormalDisableOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </NSpace>
          </NRadioGroup>
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
