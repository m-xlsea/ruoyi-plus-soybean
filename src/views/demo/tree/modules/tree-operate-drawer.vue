<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { fetchCreateTree, fetchGetTreeList, fetchUpdateTree } from '@/service/api/demo/tree';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { handleTree } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'TreeOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Demo.Tree | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const treeList = ref<Api.Demo.Tree[]>([]);

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增测试树表',
    edit: '编辑测试树表'
  };
  return titles[props.operateType];
});

type Model = Api.Demo.TreeOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: null,
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
  treeName: createRequiredRule('树节点名不能为空')
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();
  model.value.parentId = props.rowData?.id || 0;

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { id, parentId, deptId, userId, treeName } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateTree({ parentId, deptId, userId, treeName });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateTree({ id, parentId, deptId, userId, treeName });
    if (error) return;
  }

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

async function getTreeList() {
  const { data, error } = await fetchGetTreeList();
  if (error) {
    return;
  }
  const { tree } = handleTree(data);
  treeList.value = tree;
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
    getTreeList();
  }
});

const treeOptions = computed(() => {
  return [
    {
      id: 0,
      treeName: '顶级节点',
      children: treeList.value
    }
  ];
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm :model="model" :rules="rules">
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
        <NFormItem label="树节点名" path="treeName">
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
