<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { NInputNumber } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDept, fetchUpdateDept } from '@/service/api/system/dept';
import { useDict } from '@/hooks/business/dict';
defineOptions({
  name: 'DeptOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Dept | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { options: sysNormalDisableOptions } = useDict('sys_normal_disable');

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增部门',
    edit: '编辑部门'
  };
  return titles[props.operateType];
});

type Model = Api.System.DeptOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: null,
    deptName: '',
    deptCategory: '',
    orderNum: null,
    leader: null,
    phone: '',
    email: '',
    status: ''
  };
}

type RuleKey = Extract<keyof Model, 'deptId' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  deptId: createRequiredRule('部门id不能为空'),
  status: createRequiredRule('部门状态（0正常 1停用）不能为空')
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
    const { parentId, deptName, deptCategory, orderNum, leader, phone, email, status } = model;
    const { error } = await fetchCreateDept({
      parentId,
      deptName,
      deptCategory,
      orderNum,
      leader,
      phone,
      email,
      status
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { deptId, parentId, deptName, deptCategory, orderNum, leader, phone, email, status } = model;
    const { error } = await fetchUpdateDept({
      deptId,
      parentId,
      deptName,
      deptCategory,
      orderNum,
      leader,
      phone,
      email,
      status
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
        <!--
 <NFormItem label="父部门id" path="parentId">
          <NInput v-model:value="model.parentId" placeholder="请输入父部门id" />
        </NFormItem>
-->

        <NFormItem label="部门名称" path="deptName">
          <NInput v-model:value="model.deptName" placeholder="请输入部门名称" />
        </NFormItem>
        <NFormItem label="部门类别编码" path="deptCategory">
          <NInput v-model:value="model.deptCategory" placeholder="请输入部门类别编码" />
        </NFormItem>
        <NFormItem label="显示顺序" path="orderNum">
          <NInputNumber v-model:value="model.orderNum" placeholder="请输入显示顺序" />
        </NFormItem>
        <!--
 <NFormItem label="负责人" path="leader">
          <NInput v-model:value="model.leader" placeholder="请输入负责人" />
        </NFormItem>
-->
        <NFormItem label="联系电话" path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入联系电话" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="部门状态" path="status">
          <NSelect
            v-model:value="model.status"
            placeholder="请选择部门状态"
            :options="sysNormalDisableOptions"
            clearable
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
