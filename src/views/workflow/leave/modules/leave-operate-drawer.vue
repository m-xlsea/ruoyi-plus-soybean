<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import dayjs from 'dayjs';
import { leaveTypeOptions } from '@/constants/workflow';
import { fetchCreateLeave, fetchUpdateLeave } from '@/service/api/workflow';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'LeaveOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Workflow.Leave | null;
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
    add: '新增请假申请',
    edit: '编辑请假申请'
  };
  return titles[props.operateType];
});

type Model = Api.Workflow.LeaveOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    leaveType: null,
    startDate: null,
    endDate: null,
    leaveDays: null,
    remark: ''
  };
}
const dateRange = computed<[string, string] | null>({
  get: () => {
    if (!model.startDate || !model.endDate) return null;
    return [model.startDate, model.endDate] as [string, string];
  },
  set: (value: [string, string] | null) => {
    if (value) {
      model.startDate = value[0];
      model.endDate = value[1];
      // Calculate leave days when date range changes
      const start = dayjs(value[0]);
      const end = dayjs(value[1]);
      model.leaveDays = end.diff(start, 'day') + 1;
    } else {
      model.startDate = null;
      model.endDate = null;
      model.leaveDays = null;
    }
  }
});

type RuleKey = Extract<keyof Model, 'id' | 'leaveType' | 'leaveDays' | 'startDate' | 'endDate'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule('id不能为空'),
  leaveType: createRequiredRule('请假类型不能为空'),
  startDate: createRequiredRule('请假时间不能为空'),
  endDate: createRequiredRule('结束时间不能为空'),
  leaveDays: createRequiredRule('请假天数不能为空')
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
    const { leaveType, startDate, endDate, leaveDays, remark } = model;
    const { error } = await fetchCreateLeave({ leaveType, startDate, endDate, leaveDays, remark });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { id, leaveType, startDate, endDate, leaveDays, remark } = model;
    const { error } = await fetchUpdateLeave({ id, leaveType, startDate, endDate, leaveDays, remark });
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
        <NFormItem label="请假类型" path="leaveType">
          <NSelect v-model:value="model.leaveType" placeholder="请输入请假类型" :options="leaveTypeOptions" />
        </NFormItem>
        <NFormItem label="请假时间" path="startDate">
          <NDatePicker v-model:formatted-value="dateRange" type="daterange" value-format="yyyy-MM-dd" clearable />
        </NFormItem>
        <NFormItem label="请假天数" path="leaveDays">
          <NInputNumber v-model:value="model.leaveDays" disabled placeholder="请输入请假天数" />
        </NFormItem>
        <NFormItem label="请假原因" path="remark">
          <NInput v-model:value="model.remark" placeholder="请输入请假原因" />
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
