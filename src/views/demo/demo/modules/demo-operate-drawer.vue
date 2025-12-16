<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { fetchCreateDemo, fetchUpdateDemo } from '@/service/api/demo/demo';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'DemoOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Demo.Demo | null;
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
    add: '新增测试单表',
    edit: '编辑测试单表'
  };
  return titles[props.operateType];
});

type Model = Api.Demo.DemoOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: null,
    deptId: null,
    userId: null,
    orderNum: 0,
    testKey: '',
    value: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'id' | 'deptId' | 'userId' | 'orderNum' | 'testKey' | 'value'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule('主键不能为空'),
  deptId: createRequiredRule('部门不能为空'),
  userId: createRequiredRule('用户不能为空'),
  orderNum: createRequiredRule('排序号不能为空'),
  testKey: createRequiredRule('key 键不能为空'),
  value: createRequiredRule('值不能为空')
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

  const { id, deptId, userId, orderNum, testKey, value } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateDemo({ deptId, userId, orderNum, testKey, value });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateDemo({ id, deptId, userId, orderNum, testKey, value });
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
        <NFormItem label="部门" path="deptId">
          <DeptTreeSelect v-model:value="model.deptId" placeholder="请选择部门" />
        </NFormItem>
        <NFormItem label="用户" path="userId">
          <UserSelect v-model:value="model.userId" placeholder="请选择用户" />
        </NFormItem>
        <NFormItem label="排序号" path="orderNum">
          <NInputNumber v-model:value="model.orderNum" placeholder="请输入排序号" />
        </NFormItem>
        <NFormItem label="key 键" path="testKey">
          <NInput v-model:value="model.testKey" placeholder="请输入 key 键" />
        </NFormItem>
        <NFormItem label="值" path="value">
          <NInput v-model:value="model.value" placeholder="请输入值" />
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
