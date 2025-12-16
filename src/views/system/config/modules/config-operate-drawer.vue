<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
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

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.config.addConfig'),
    edit: $t('page.system.config.editConfig')
  };
  return titles[props.operateType];
});

type Model = Api.System.ConfigOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    configName: '',
    configKey: '',
    configValue: '',
    configType: 'Y',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'configId' | 'configName' | 'configKey' | 'configValue' | 'configType'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  configId: createRequiredRule($t('page.system.config.form.configId.required')),
  configName: createRequiredRule($t('page.system.config.form.configName.required')),
  configKey: createRequiredRule($t('page.system.config.form.configKey.required')),
  configValue: createRequiredRule($t('page.system.config.form.configValue.required')),
  configType: createRequiredRule($t('page.system.config.form.configType.required'))
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}
function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { configId, configName, configKey, configValue, configType, remark } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateConfig({ configName, configKey, configValue, configType, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
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
      <NForm :model="model" :rules="rules">
        <NFormItem :label="$t('page.system.config.configName')" path="configName">
          <NInput v-model:value="model.configName" :placeholder="$t('page.system.config.form.configName.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.config.configKey')" path="configKey">
          <NInput v-model:value="model.configKey" :placeholder="$t('page.system.config.form.configKey.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.config.configValue')" path="configValue">
          <NInput
            v-model:value="model.configValue"
            :rows="3"
            :placeholder="$t('page.system.config.form.configValue.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.config.configType')" path="configType">
          <DictRadio v-model:value="model.configType" dict-code="sys_yes_no" />
        </NFormItem>
        <NFormItem :label="$t('page.system.config.remark')" path="remark">
          <NInput
            v-model:value="model.remark"
            :rows="3"
            type="textarea"
            :placeholder="$t('page.system.config.form.remark.required')"
          />
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
