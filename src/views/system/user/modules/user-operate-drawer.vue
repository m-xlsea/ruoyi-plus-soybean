<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateUser, fetchUpdateUser } from '@/service/api/system';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.User | null;
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
    add: '新增用户信息',
    edit: '编辑用户信息'
  };
  return titles[props.operateType];
});

type Model = Api.System.UserOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    deptId: null,
    userName: '',
    nickName: '',
    email: '',
    phonenumber: '',
    sex: '',
    password: '',
    status: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'nickName' | 'password' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: createRequiredRule('用户名称不能为空'),
  nickName: createRequiredRule('用户昵称不能为空'),
  password: createRequiredRule('密码不能为空'),
  status: createRequiredRule('帐号状态不能为空')
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
    const { deptId, userName, nickName, email, phonenumber, sex, password, status, remark } = model;
    const { error } = await fetchCreateUser({
      deptId,
      userName,
      nickName,
      email,
      phonenumber,
      sex,
      password,
      status,
      remark
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { userId, deptId, userName, nickName, email, phonenumber, sex, password, status, remark } = model;
    const { error } = await fetchUpdateUser({
      userId,
      deptId,
      userName,
      nickName,
      email,
      phonenumber,
      sex,
      password,
      status,
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
        <NFormItem label="部门" path="deptId">
          <!-- <NInput v-model:value="model.deptId" placeholder="请输入部门" /> -->
        </NFormItem>
        <NFormItem label="用户名称" path="userName">
          <NInput v-model:value="model.userName" placeholder="请输入用户名称" />
        </NFormItem>
        <NFormItem label="用户昵称" path="nickName">
          <NInput v-model:value="model.nickName" placeholder="请输入用户昵称" />
        </NFormItem>
        <NFormItem label="用户邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="请输入用户邮箱" />
        </NFormItem>
        <NFormItem label="手机号码" path="phonenumber">
          <NInput v-model:value="model.phonenumber" placeholder="请输入手机号码" />
        </NFormItem>
        <NFormItem label="用户性别" path="sex">
          <DictRadio v-model:value="model.sex" dict-code="sys_user_sex" />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput v-model:value="model.password" placeholder="请输入密码" />
        </NFormItem>
        <NFormItem label="帐号状态" path="status">
          <NInput v-model:value="model.status" placeholder="请输入帐号状态" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" placeholder="请输入备注" />
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
