<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { fetchCreateDictType, fetchUpdateDictType } from '@/service/api/system/dict';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

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

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.dict.addDictType'),
    edit: $t('page.system.dict.editDictType')
  };
  return titles[props.operateType];
});

type Model = Api.System.DictTypeOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    dictName: '',
    dictType: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'dictId' | 'dictName' | 'dictType'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  dictId: createRequiredRule($t('page.system.dict.form.dictValue.invalid')),
  dictName: createRequiredRule($t('page.system.dict.form.dictName.invalid')),
  dictType: createRequiredRule($t('page.system.dict.form.dictType.invalid'))
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

  const { dictId, dictName, dictType, remark } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateDictType({ dictName, dictType, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
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
      <NForm :model="model" :rules="rules">
        <NFormItem :label="$t('page.system.dict.dictName')" path="dictName">
          <NInput v-model:value="model.dictName" :placeholder="$t('page.system.dict.form.dictName.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.dictType')" path="dictType">
          <NInput v-model:value="model.dictType" :placeholder="$t('page.system.dict.form.dictValue.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dict.remark')" path="remark">
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
