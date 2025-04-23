<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NInputNumber } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchCreateDept, fetchGetDeptList, fetchGetExcludeDeptList, fetchUpdateDept } from '@/service/api/system/dept';
import { fetchGetDeptUserList } from '@/service/api/system/user';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { handleTree } from '@/utils/common';
import { $t } from '@/locales';

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

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule, patternRules } = useFormRules();

const { loading: deptLoading, startLoading: startDeptLoading, endLoading: endDeptLoading } = useLoading();
const { loading: userLoading, startLoading: startUserLoading, endLoading: endUserLoading } = useLoading();
const deptData = ref<Api.System.Dept[]>([]);
const userOptions = ref<CommonType.Option<CommonType.IdType>[]>([]);
const placeholder = ref<string>('请选择负责人');
const disabled = ref<boolean>(false);

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
    parentId: props.rowData?.deptId,
    deptName: '',
    deptCategory: '',
    orderNum: null,
    leader: null,
    phone: '',
    email: '',
    status: '0'
  };
}

type RuleKey = Extract<keyof Model, 'deptId' | 'parentId' | 'orderNum' | 'deptName' | 'phone' | 'email'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  deptId: createRequiredRule('部门id不能为空'),
  parentId: createRequiredRule('上级部门不能为空'),
  orderNum: createRequiredRule('显示顺序不能为空'),
  deptName: createRequiredRule('部门名称不能为空'),
  phone: patternRules.phone,
  email: patternRules.email
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
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

async function getDeptData() {
  startDeptLoading();
  const { data, error } =
    props.operateType === 'add' ? await fetchGetDeptList() : await fetchGetExcludeDeptList(props.rowData?.deptId);

  if (error) {
    window.$message?.error(error.message || '获取部门数据失败');
    return;
  }

  if (data) {
    deptData.value = handleTree(data, { idField: 'deptId' });
  }
  endDeptLoading();
}

async function getUserData() {
  if (props.operateType === 'add' || !props.rowData?.deptId) {
    placeholder.value = '仅在更新时可选择部门负责人';
    disabled.value = true;
    return;
  }
  startUserLoading();
  const { data, error } = await fetchGetDeptUserList(props.rowData.deptId);
  if (error) {
    window.$message?.error(error.message || '获取部门用户数据失败');
    return;
  }
  if (data.length === 0) {
    placeholder.value = '该部门没有负责人';
    disabled.value = true;
  }
  userOptions.value = data.map(item => ({
    label: `${item.userName} | ${item.nickName}`,
    value: item.userId
  }));
  endUserLoading();
}

watch(visible, () => {
  if (visible.value) {
    disabled.value = false;
    getDeptData();
    getUserData();
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="上级部门" path="parentId">
          <NTreeSelect
            v-model:value="model.parentId"
            :loading="deptLoading"
            clearable
            :options="deptData"
            label-field="deptName"
            key-field="deptId"
            default-expand-all
            placeholder="请选择上级部门"
          />
        </NFormItem>
        <NFormItem label="部门名称" path="deptName">
          <NInput v-model:value="model.deptName" placeholder="请输入部门名称" />
        </NFormItem>
        <NFormItem label="显示顺序" path="orderNum">
          <NInputNumber v-model:value="model.orderNum" class="w-full" placeholder="请输入显示顺序" />
        </NFormItem>
        <NFormItem label="部门类别编码" path="deptCategory">
          <NInput v-model:value="model.deptCategory" placeholder="请输入部门类别编码" />
        </NFormItem>

        <NFormItem label="负责人" path="leader">
          <NSelect
            v-model:value="model.leader"
            :loading="userLoading"
            :disabled="disabled"
            :placeholder="placeholder"
            :options="userOptions"
          />
        </NFormItem>

        <NFormItem label="联系电话" path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入联系电话" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="部门状态" path="status">
          <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
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
