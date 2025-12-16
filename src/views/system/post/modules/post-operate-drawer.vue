<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { useLoading } from '@sa/hooks';
import { fetchCreatePost, fetchUpdatePost } from '@/service/api/system/post';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PostOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Post | null;
  /** the dept tree data */
  deptData?: Api.Common.CommonTreeRecord;
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
const { loading: deptLoading, startLoading: startDeptLoading, endLoading: endDeptLoading } = useLoading();
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增岗位信息',
    edit: '编辑岗位信息'
  };
  return titles[props.operateType];
});

type Model = Api.System.PostOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    deptId: null,
    postCode: '',
    postCategory: '',
    postName: '',
    postSort: null,
    status: '0',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'postId' | 'deptId' | 'postCode' | 'postName' | 'postSort' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  postId: createRequiredRule('岗位ID不能为空'),
  deptId: createRequiredRule('归属部门不能为空'),
  postCode: createRequiredRule('岗位编码不能为空'),
  postName: createRequiredRule('岗位名称不能为空'),
  postSort: createRequiredRule('显示顺序不能为空'),
  status: createRequiredRule('状态不能为空')
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    startDeptLoading();
    Object.assign(model.value, jsonClone(props.rowData));
    endDeptLoading();
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { postId, deptId, postCode, postCategory, postName, postSort, status, remark } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreatePost({ deptId, postCode, postCategory, postName, postSort, status, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdatePost({
      postId,
      deptId,
      postCode,
      postCategory,
      postName,
      postSort,
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
      <NForm :model="model" :rules="rules">
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
        <NFormItem label="岗位编码" path="postCode">
          <NInput v-model:value="model.postCode" placeholder="请输入岗位编码" />
        </NFormItem>
        <NFormItem label="类别编码" path="postCategory">
          <NInput v-model:value="model.postCategory" placeholder="请输入类别编码" />
        </NFormItem>
        <NFormItem label="岗位名称" path="postName">
          <NInput v-model:value="model.postName" placeholder="请输入岗位名称" />
        </NFormItem>
        <NFormItem label="显示顺序" path="postSort">
          <NInputNumber v-model:value="model.postSort" placeholder="请输入显示顺序" />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
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
