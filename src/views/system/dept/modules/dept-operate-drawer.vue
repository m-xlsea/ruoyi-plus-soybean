<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NInputNumber } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
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

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule, patternRules } = useFormRules();

const { loading: deptLoading, startLoading: startDeptLoading, endLoading: endDeptLoading } = useLoading();
const { loading: userLoading, startLoading: startUserLoading, endLoading: endUserLoading } = useLoading();
const deptData = ref<Api.System.Dept[]>([]);
const userOptions = ref<CommonType.Option<CommonType.IdType>[]>([]);
const placeholder = ref<string>($t('page.system.dept.placeholder.defaultLeaderPlaceHolder'));
const disabled = ref<boolean>(false);
const expandedKeys = ref<CommonType.IdType[]>([]);

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.dept.addDept'),
    edit: $t('page.system.dept.editDept')
  };
  return titles[props.operateType];
});

type Model = Api.System.DeptOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: props.rowData?.deptId || '',
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
  deptId: createRequiredRule($t('page.system.dept.form.deptId.invalid')),
  parentId: createRequiredRule($t('page.system.dept.form.parentId.invalid')),
  orderNum: createRequiredRule($t('page.system.dept.form.orderNum.invalid')),
  deptName: createRequiredRule($t('page.system.dept.form.deptName.invalid')),
  phone: patternRules.phone,
  email: patternRules.email
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

  const { deptId, parentId, deptName, deptCategory, orderNum, leader, phone, email, status } = model.value;

  // request
  if (props.operateType === 'add') {
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
    window.$message?.error(error.message || $t('page.system.dept.error.getDeptDataFail'));
    return;
  }

  if (data) {
    const { tree } = handleTree(data, { idField: 'deptId' });
    deptData.value = tree;
    if (deptData.value?.length) {
      expandedKeys.value = [deptData.value[0].deptId];
    }
  }
  endDeptLoading();
}

async function getUserData() {
  if (props.operateType === 'add' || !props.rowData?.deptId) {
    placeholder.value = $t('page.system.dept.placeholder.addDataLeaderPlaceHolder');
    disabled.value = true;
    return;
  }
  startUserLoading();
  const { data, error } = await fetchGetDeptUserList(props.rowData.deptId);
  if (error) {
    window.$message?.error(error.message || $t('page.system.dept.error.getDeptUserDataFail'));
    return;
  }
  if (data.length === 0) {
    placeholder.value = $t('page.system.dept.placeholder.deptUserIsEmptyLeaderPlaceHolder');
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
      <NForm :model="model" :rules="rules">
        <NFormItem v-if="model.parentId !== 0" :label="$t('page.system.dept.parentId')" path="parentId">
          <NTreeSelect
            v-model:value="model.parentId"
            v-model:expanded-keys="expandedKeys"
            :loading="deptLoading"
            clearable
            :options="deptData"
            label-field="deptName"
            key-field="deptId"
            :placeholder="$t('page.system.dept.form.parentId.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.dept.deptName')" path="deptName">
          <NInput v-model:value="model.deptName" :placeholder="$t('page.system.dept.form.deptName.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dept.orderNum')" path="orderNum">
          <NInputNumber
            v-model:value="model.orderNum"
            class="w-full"
            :placeholder="$t('page.system.dept.form.orderNum.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.dept.deptCategory')" path="deptCategory">
          <NInput v-model:value="model.deptCategory" :placeholder="$t('page.system.dept.form.deptCategory.required')" />
        </NFormItem>

        <NFormItem :label="$t('page.system.dept.leader')" path="leader">
          <NSelect
            v-model:value="model.leader"
            :loading="userLoading"
            :disabled="disabled"
            :placeholder="placeholder"
            :options="userOptions"
          />
        </NFormItem>

        <NFormItem :label="$t('page.system.dept.phone')" path="phone">
          <NInput v-model:value="model.phone" :placeholder="$t('page.system.dept.form.phone.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dept.email')" path="email">
          <NInput v-model:value="model.email" :placeholder="$t('page.system.dept.form.email.required')" />
        </NFormItem>
        <NFormItem :label="$t('page.system.dept.status')" path="status">
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
