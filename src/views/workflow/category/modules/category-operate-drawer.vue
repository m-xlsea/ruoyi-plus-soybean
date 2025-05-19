<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { fetchCreateCategory, fetchUpdateCategory } from '@/service/api/workflow';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
defineOptions({
  name: 'WorkflowCategoryOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Workflow.WorkflowCategory | null;
  /** the category data */
  categoryTreeList?: Api.Workflow.WorkflowCategory[] | null;
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
    add: '新增测试树',
    edit: '编辑测试树'
  };
  return titles[props.operateType];
});

type Model = Api.Workflow.WorkflowCategoryOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: null,
    categoryName: '',
    orderNum: 0
  };
}

type RuleKey = Extract<keyof Model, 'categoryId' | 'parentId' | 'categoryName'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  categoryId: createRequiredRule('主键不能为空'),
  parentId: createRequiredRule('上级分类不能为空'),
  categoryName: createRequiredRule('分类名称不能为空')
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    model.parentId = props.rowData?.categoryId || 0;
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
    const { parentId, categoryName, orderNum } = model;
    const { error } = await fetchCreateCategory({ parentId, categoryName, orderNum });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { categoryId, parentId, categoryName, orderNum } = model;
    const { error } = await fetchUpdateCategory({ categoryId, parentId, categoryName, orderNum });
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
        <NFormItem label="上级分类" path="parentId">
          <NTreeSelect
            v-model:value="model.parentId"
            filterable
            class="h-full"
            key-field="categoryId"
            label-field="categoryName"
            :options="categoryTreeList!"
            :default-expanded-keys="[0]"
          />
        </NFormItem>
        <NFormItem label="分类名称" path="categoryName">
          <NInput v-model:value="model.categoryName" placeholder="请输入分类名称" />
        </NFormItem>
        <NFormItem label="排序" path="orderNum">
          <NInputNumber v-model:value="model.orderNum" placeholder="请输入排序" />
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
