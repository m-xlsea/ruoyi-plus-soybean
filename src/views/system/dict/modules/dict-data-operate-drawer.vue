<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NTag } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { fetchCreateDictData, fetchUpdateDictData } from '@/service/api/system/dict-data';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';

defineOptions({
  name: 'DictDataOperateDrawer'
});
useDict('sys_yes_no');
interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.DictData | null;
  dictType: string;
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
    add: $t('page.system.dict.addDictData'),
    edit: $t('page.system.dict.editDictData')
  };
  return titles[props.operateType];
});

type Model = Api.System.DictDataOperateParams;

const model = ref<Model>(createDefaultModel());

const listClassOptions: Record<string, string>[] = [
  { label: 'Text', value: 'text' },
  { label: 'Default', value: 'default' },
  { label: 'Tertiary', value: 'tertiary' },
  { label: 'Primary', value: 'primary' },
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' }
];

function createDefaultModel(): Model {
  return {
    dictSort: 0,
    dictLabel: '',
    dictValue: '',
    dictType: props.dictType,
    cssClass: '',
    listClass: null,
    remark: '',
    isDefault: 'N'
  };
}

type RuleKey = Extract<keyof Model, 'dictCode' | 'dictLabel' | 'dictValue'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  dictCode: createRequiredRule($t('page.system.dict.form.dictCode.invalid')),
  dictLabel: createRequiredRule($t('page.system.dict.form.dictLabel.invalid')),
  dictValue: createRequiredRule($t('page.system.dict.form.dictValue.invalid'))
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

  const { dictCode, dictSort, dictLabel, dictValue, dictType, cssClass, listClass, isDefault, remark } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateDictData({
      dictSort,
      dictLabel,
      dictValue,
      dictType,
      cssClass,
      listClass,
      isDefault,
      remark
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateDictData({
      dictCode,
      dictSort,
      dictLabel,
      dictValue,
      dictType,
      cssClass,
      listClass,
      isDefault,
      remark
    });
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

function renderTagLabel(option: { label: string; value: string }) {
  if (option.value === 'text') {
    return option.label;
  }
  return (
    <NTag size="small" type={option.value as any}>
      {option.label}
    </NTag>
  );
}
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm :model="model" :rules="rules">
        <NFormItem :label="$t('page.system.dict.dictType')" path="dictType">
          <NInput
            v-model:value="model.dictType"
            disabled
            :placeholder="$t('page.system.dict.form.dictType.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.listClass')" path="listClass">
          <NSelect
            v-model:value="model.listClass"
            clearable
            :options="listClassOptions"
            :placeholder="$t('page.system.dict.form.listClass.required')"
            :render-label="renderTagLabel"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.label')" path="dictLabel">
          <NInput v-model:value="model.dictLabel" :placeholder="$t('page.system.dict.form.dictLabel.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.value')" path="dictValue">
          <NInput v-model:value="model.dictValue" :placeholder="$t('page.system.dict.form.dictValue.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.cssClass')" path="cssClass">
          <NInput v-model:value="model.cssClass" :placeholder="$t('page.system.dict.form.cssClass.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.dictSort')" path="dictSort">
          <NInputNumber v-model:value="model.dictSort" :placeholder="$t('page.system.dict.form.dictSort.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.isDefault')" path="isDefault">
          <DictRadio v-model:value="model.isDefault" dict-code="sys_yes_no" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.data.remark')" path="remark">
          <NInput
            v-model:value="model.remark"
            :rows="3"
            type="textarea"
            :placeholder="$t('page.system.dict.form.remark.required')"
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
