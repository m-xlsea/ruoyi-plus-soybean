<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useBoolean } from '@sa/hooks';
import { flowCodeTypeOptions, leaveTypeOptions } from '@/constants/workflow';
import { fetchCreateLeave, fetchStartWorkflow, fetchUpdateLeave } from '@/service/api/workflow';
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
const { bool: taskApplyVisible, setTrue: setTaskApplyVisible } = useBoolean();
const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增请假申请',
    edit: '编辑请假申请'
  };
  return titles[props.operateType];
});

const respLeave = ref<Api.Workflow.Leave>();
const startWorkflowResult = ref<Api.Workflow.StartWorkflowResult>();

type Model = Api.Workflow.LeaveOperateParams & {
  flowCode: Api.Workflow.FlowCodeType;
};
type StartWorkflowModel = Api.Workflow.StartWorkflowOperateParams;

const model: Model = reactive(createDefaultModel());

const startWorkflowModel: StartWorkflowModel = reactive(createDefaultStartWorkflowModel());

function createDefaultModel(): Model {
  return {
    flowCode: 'leave1',
    leaveType: null,
    startDate: null,
    endDate: null,
    leaveDays: null,
    remark: ''
  };
}

function createDefaultStartWorkflowModel(): StartWorkflowModel {
  return {
    flowCode: null,
    businessId: null,
    variables: {}
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

type RuleKey = Extract<keyof Model, 'id' | 'leaveType' | 'leaveDays' | 'startDate' | 'endDate'> | 'flowCode';

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule('id不能为空'),
  flowCode: createRequiredRule('流程类型不能为空'),
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

async function handleOperate() {
  await validate();
  // request
  if (props.operateType === 'add') {
    const { leaveType, startDate, endDate, leaveDays, remark } = model;
    const { error, data } = await fetchCreateLeave({ leaveType, startDate, endDate, leaveDays, remark });
    if (error) return;
    respLeave.value = data;
  }

  if (props.operateType === 'edit') {
    const { id, leaveType, startDate, endDate, leaveDays, remark } = model;
    const { error, data } = await fetchUpdateLeave({ id, leaveType, startDate, endDate, leaveDays, remark });
    if (error) return;
    respLeave.value = data;
  }
}

async function handleSaveDraft() {
  await handleOperate();
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
}

const taskVariables = ref<{ [key: string]: any }>({});

async function handleSubmit() {
  await handleOperate();
  // 提交流程
  startWorkflowModel.businessId = respLeave.value?.id;
  startWorkflowModel.flowCode = model.flowCode;
  taskVariables.value = {
    leaveDays: respLeave.value?.leaveDays,
    userList: ['1', '3', '4']
  };
  startWorkflowModel.variables = taskVariables.value;
  const { error, data } = await fetchStartWorkflow(startWorkflowModel);
  if (error) return;
  startWorkflowResult.value = data;
  window.$message?.success($t('common.updateSuccess'));
  setTaskApplyVisible();
}

function handleTaskFinished() {
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
      <div></div>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="流程类型" path="flowCode">
          <NSelect v-model:value="model.flowCode" placeholder="请输入流程类型" :options="flowCodeTypeOptions" />
        </NFormItem>
        <NFormItem label="请假类型" path="leaveType">
          <NSelect v-model:value="model.leaveType" placeholder="请输入请假类型" :options="leaveTypeOptions" />
        </NFormItem>
        <NFormItem label="请假时间" path="startDate">
          <NDatePicker
            v-model:formatted-value="dateRange"
            class="w-full"
            type="daterange"
            value-format="yyyy-MM-dd"
            clearable
          />
        </NFormItem>
        <NFormItem label="请假天数" path="leaveDays">
          <NInputNumber v-model:value="model.leaveDays" class="w-full" disabled placeholder="请输入请假天数" />
        </NFormItem>
        <NFormItem label="请假原因" path="remark">
          <NInput v-model:value="model.remark" placeholder="请输入请假原因" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="warning" @click="handleSaveDraft">暂存</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
    <WorkflowTaskApplyModal
      v-model:visible="taskApplyVisible"
      :task-id="startWorkflowResult?.taskId || ''"
      :task-variables="taskVariables"
      @finished="handleTaskFinished"
    />
  </NDrawer>
</template>

<style scoped></style>
