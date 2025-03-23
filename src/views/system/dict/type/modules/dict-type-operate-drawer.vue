<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDictType, fetchUpdateDictType } from '@/service/api/system/dict';

defineOptions({
  name: 'DictTypeOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.DictType | null;
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
    add: '新增字典类型',
    edit: '编辑字典类型'
  };
  return titles[props.operateType];
});

type Model = Api.System.DictTypeOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    dictName: '',
    dictType: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'dictId'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  dictId: createRequiredRule('字典主键不能为空')
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
    const { dictName, dictType, remark } = model;
    const { error } = await fetchCreateDictType({ dictName, dictType, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { dictId, dictName, dictType, remark } = model;
    const { error } = await fetchUpdateDictType({ dictId, dictName, dictType, remark });
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
        <NFormItem label="字典名称" path="dictName">
          <NInput v-model:value="model.dictName" placeholder="请输入字典名称" />
        </NFormItem>
        <NFormItem label="字典类型" path="dictType">
          <NInput v-model:value="model.dictType" placeholder="请输入字典类型" />
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
