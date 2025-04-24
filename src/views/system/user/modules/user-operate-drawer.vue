<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchCreateUser, fetchGetUserInfo, fetchUpdateUser } from '@/service/api/system';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.User | null;
  /** the dept tree data */
  deptData?: Api.Common.CommonTreeRecord;
  /** the dept id */
  deptId?: CommonType.IdType | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { loading, startLoading, endLoading } = useLoading();
const { loading: deptLoading, startLoading: startDeptLoading, endLoading: endDeptLoading } = useLoading();
const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule, patternRules } = useFormRules();

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
    status: '0',
    roleIds: [],
    postIds: [],
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'nickName' | 'password' | 'status' | 'phonenumber'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  userName: [createRequiredRule('用户名称不能为空')],
  nickName: [createRequiredRule('用户昵称不能为空')],
  password: [createRequiredRule('密码不能为空'), patternRules.pwd],
  phonenumber: [patternRules.phone],
  status: [createRequiredRule('帐号状态不能为空')]
};

async function getUserInfo() {
  startLoading();
  const { error, data } = await fetchGetUserInfo(props.rowData?.userId);
  if (!error) {
    model.roleIds = data.roleIds;
    model.postIds = data.postIds;
  }
  endLoading();
}

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    model.deptId = props.deptId;
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    startDeptLoading();
    Object.assign(model, props.rowData);
    getUserInfo();
    endDeptLoading();
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
      <NSpin :show="loading">
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="用户昵称" path="nickName">
            <NInput v-model:value="model.nickName" placeholder="请输入用户昵称" />
          </NFormItem>
          <NFormItem label="归属部门" path="deptId">
            <NTreeSelect
              v-model:value="model.deptId"
              :loading="deptLoading"
              clearable
              :options="deptData as []"
              label-field="label"
              key-field="id"
              :default-expanded-keys="deptData?.length ? [deptData[0].id] : []"
              placeholder="请选择归属部门"
            />
          </NFormItem>
          <NFormItem label="手机号码" path="phonenumber">
            <NInput v-model:value="model.phonenumber" placeholder="请输入手机号码" />
          </NFormItem>
          <NFormItem label="邮箱" path="email">
            <NInput v-model:value="model.email" placeholder="请输入邮箱" />
          </NFormItem>
          <NFormItem v-if="operateType === 'add'" label="用户名称" path="userName">
            <NInput v-model:value="model.userName" placeholder="请输入用户名称" />
          </NFormItem>
          <NFormItem v-if="operateType === 'add'" label="用户密码" path="password">
            <NInput
              v-model:value="model.password"
              type="password"
              show-password-on="click"
              placeholder="请输入用户密码"
            />
          </NFormItem>
          <NFormItem label="用户性别" path="sex">
            <DictRadio v-model:value="model.sex" dict-code="sys_user_sex" placeholder="请选择用户性别" />
          </NFormItem>
          <NFormItem label="岗位" path="postIds">
            <PostSelect v-model:value="model.postIds" :dept-id="model.deptId" multiple clearable />
          </NFormItem>
          <NFormItem label="角色" path="roleIds">
            <RoleSelect v-model:value="model.roleIds" multiple clearable />
          </NFormItem>
          <NFormItem label="状态" path="status">
            <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
          </NFormItem>
          <NFormItem label="备注" path="remark">
            <NInput v-model:value="model.remark" placeholder="请输入备注" />
          </NFormItem>
        </NForm>
      </NSpin>
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
