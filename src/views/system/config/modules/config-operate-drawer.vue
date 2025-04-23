<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { fetchCreateConfig, fetchUpdateConfig } from '@/service/api/system/config';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ConfigOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Config | null;
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
    add: '新增参数配置',
    edit: '编辑参数配置'
  };
  return titles[props.operateType];
});

type Model = Api.System.ConfigOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    configName: '',
    configKey: '',
    configValue: '',
    configType: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'configId' | 'configName' | 'configKey' | 'configValue' | 'configType'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  configId: createRequiredRule('参数主键不能为空'),
  configName: createRequiredRule('参数名称不能为空'),
  configKey: createRequiredRule('参数键名不能为空'),
  configValue: createRequiredRule('参数键值不能为空'),
  configType: createRequiredRule('是否内置不能为空')
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
    const { configName, configKey, configValue, configType, remark } = model;
    const { error } = await fetchCreateConfig({ configName, configKey, configValue, configType, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { configId, configName, configKey, configValue, configType, remark } = model;
    const { error } = await fetchUpdateConfig({ configId, configName, configKey, configValue, configType, remark });
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
        <NFormItem label="参数名称" path="configName">
          <NInput v-model:value="model.configName" placeholder="请输入参数名称" />
        </NFormItem>
        <NFormItem label="参数键名" path="configKey">
          <NInput v-model:value="model.configKey" placeholder="请输入参数键名" />
        </NFormItem>
        <NFormItem label="参数键值" path="configValue">
          <NInput v-model:value="model.configValue" :rows="3" placeholder="请输入参数键值" />
        </NFormItem>
        <NFormItem label="是否内置" path="configType">
          <DictRadio v-model:value="model.configType" dict-code="sys_yes_no" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" :rows="3" type="textarea" placeholder="请输入备注" />
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
