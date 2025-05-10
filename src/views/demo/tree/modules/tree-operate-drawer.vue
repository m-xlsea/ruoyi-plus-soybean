<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { fetchCreateTree, fetchUpdateTree } from '@/service/api/demo/tree';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'TreeOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Demo.Tree | null;
  /** the tree data */
  treeList?: Api.Demo.Tree[] | null;
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

type Model = Api.Demo.TreeOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: null,
    deptId: null,
    userId: null,
    treeName: ''
  };
}

type RuleKey = Extract<keyof Model, 'id' | 'parentId' | 'deptId' | 'userId' | 'treeName'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule('主键不能为空'),
  parentId: createRequiredRule('父 ID 不能为空'),
  deptId: createRequiredRule('部门不能为空'),
  userId: createRequiredRule('用户不能为空'),
  treeName: createRequiredRule('值不能为空')
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    model.parentId = props.rowData?.id || 0;
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
    const { parentId, deptId, userId, treeName } = model;
    const { error } = await fetchCreateTree({ parentId, deptId, userId, treeName });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { id, parentId, deptId, userId, treeName } = model;
    const { error } = await fetchUpdateTree({ id, parentId, deptId, userId, treeName });
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

const treeOptions = computed(() => {
  return [
    {
      id: 0,
      treeName: '顶级节点',
      children: props.treeList!
    }
  ];
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="父 ID" path="parentId">
          <NTreeSelect
            v-model:value="model.parentId"
            filterable
            class="h-full"
            key-field="id"
            label-field="treeName"
            :options="treeOptions"
            :default-expanded-keys="[0]"
          />
        </NFormItem>
        <NFormItem label="部门" path="deptId">
          <DeptTreeSelect v-model:value="model.deptId" placeholder="请选择部门" />
        </NFormItem>
        <NFormItem label="用户" path="userId">
          <UserSelect v-model:value="model.userId" placeholder="请选择用户" />
        </NFormItem>
        <NFormItem label="值" path="treeName">
          <NInput v-model:value="model.treeName" placeholder="请输入值" />
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
