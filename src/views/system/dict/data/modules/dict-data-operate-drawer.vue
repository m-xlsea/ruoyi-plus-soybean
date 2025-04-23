<script setup lang="ts">
import { computed, h, reactive, watch } from 'vue';
import { NTag } from 'naive-ui';
import { fetchCreateDictData, fetchUpdateDictData } from '@/service/api/system/dict-data';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'DictDataOperateDrawer'
});

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

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增字典数据',
    edit: '编辑字典数据'
  };
  return titles[props.operateType];
});

type Model = Api.System.DictDataOperateParams;

const model: Model = reactive(createDefaultModel());

const listClassOptions = [
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'info', value: 'info' },
  { label: 'warning', value: 'warning' },
  { label: 'error', value: 'error' },
  { label: 'default', value: 'default' }
];

function createDefaultModel(): Model {
  return {
    dictSort: 0,
    dictLabel: '',
    dictValue: '',
    dictType: props.dictType,
    cssClass: '',
    listClass: null,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'dictCode' | 'dictLabel' | 'dictValue'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  dictCode: createRequiredRule('字典编码不能为空'),
  dictLabel: createRequiredRule('字典标签不能为空'),
  dictValue: createRequiredRule('字典键值不能为空')
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
    const { dictSort, dictLabel, dictValue, dictType, cssClass, listClass, remark } = model;
    const { error } = await fetchCreateDictData({
      dictSort,
      dictLabel,
      dictValue,
      dictType,
      cssClass,
      listClass,
      remark
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { dictCode, dictSort, dictLabel, dictValue, dictType, cssClass, listClass, remark } = model;
    const { error } = await fetchUpdateDictData({
      dictCode,
      dictSort,
      dictLabel,
      dictValue,
      dictType,
      cssClass,
      listClass,
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
  return h('div', { class: 'flex items-center gap-2' }, [
    h(NTag, { type: option.value as any }, { default: () => option.label })
  ]);
}
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="字典类型" path="dictType">
          <NInput v-model:value="model.dictType" disabled placeholder="请输入字典类型" />
        </NFormItem>
        <NFormItem label="标签样式" path="listClass">
          <NSelect
            v-model:value="model.listClass"
            :options="listClassOptions"
            placeholder="请选择标签样式"
            :render-label="renderTagLabel"
          />
        </NFormItem>
        <NFormItem label="数据标签" path="dictLabel">
          <NInput v-model:value="model.dictLabel" placeholder="请输入字典标签" />
        </NFormItem>
        <NFormItem label="数据键值" path="dictValue">
          <NInput v-model:value="model.dictValue" placeholder="请输入字典键值" />
        </NFormItem>
        <NFormItem label="css类名" path="cssClass">
          <NInput v-model:value="model.cssClass" placeholder="请输入样式属性（其他样式扩展）" />
        </NFormItem>
        <NFormItem label="显示排序" path="dictSort">
          <NInputNumber v-model:value="model.dictSort" placeholder="请输入字典排序" />
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
