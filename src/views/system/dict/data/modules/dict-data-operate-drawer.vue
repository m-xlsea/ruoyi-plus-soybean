<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDictData, fetchUpdateDictData } from '@/service/api/system/dict-data';

defineOptions({
  name: 'DictDataOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.DictData | null;
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

function createDefaultModel(): Model {
  return {
    dictSort: null,
    dictLabel: '',
    dictValue: '',
    dictType: '',
    cssClass: '',
    listClass: null,
    isDefault: '',
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
    const { dictSort, dictLabel, dictValue, dictType, cssClass, listClass, isDefault, remark } = model;
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
    const { dictCode, dictSort, dictLabel, dictValue, dictType, cssClass, listClass, isDefault, remark } = model;
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
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="字典排序" path="dictSort">
          <NInputNumber v-model:value="model.dictSort" placeholder="请输入字典排序" />
        </NFormItem>
        <NFormItem label="字典标签" path="dictLabel">
          <NInput v-model:value="model.dictLabel" placeholder="请输入字典标签" />
        </NFormItem>
        <NFormItem label="字典键值" path="dictValue">
          <NInput v-model:value="model.dictValue" placeholder="请输入字典键值" />
        </NFormItem>
        <NFormItem label="字典类型" path="dictType">
          <NInput v-model:value="model.dictType" placeholder="请输入字典类型" />
        </NFormItem>
        <NFormItem label="样式属性（其他样式扩展）" path="cssClass">
          <NInput v-model:value="model.cssClass" placeholder="请输入样式属性（其他样式扩展）" />
        </NFormItem>
        <NFormItem label="表格回显样式" path="listClass">
          <NInput v-model:value="model.listClass" placeholder="请输入表格回显样式" />
        </NFormItem>
        <NFormItem label="是否默认（Y是 N否）" path="isDefault">
          <NInput v-model:value="model.isDefault" placeholder="请输入是否默认（Y是 N否）" />
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
@/service/api/system/dict-data
