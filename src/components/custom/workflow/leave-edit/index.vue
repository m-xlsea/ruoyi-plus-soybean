<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useBoolean, useLoading } from '@sa/hooks';
import { flowCodeTypeOptions, flowCodeTypeRecord, leaveTypeOptions, leaveTypeRecord } from '@/constants/workflow';
import { fetchCreateLeave, fetchGetLeaveDetail, fetchStartWorkflow, fetchUpdateLeave } from '@/service/api/workflow';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import ApprovalInfoPanel from '@/components/custom/workflow/approval-info-panel.vue';
import WorkflowTaskApplyModal from '@/components/custom/workflow/workflow-task-apply-modal.vue';

defineOptions({
  name: 'LeaveEdit'
});

useDict('wf_task_status');

interface Props {
  operateType: CommonType.WorkflowTableOperateType;
  /** 业务ID */
  businessId?: CommonType.IdType;
  /** the edit row data */
  rowData?: Api.Workflow.Leave | null;
}

const props = withDefaults(defineProps<Props>(), {
  rowData: null,
  businessId: undefined
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});
const approvalInfoPanelRef = ref<InstanceType<typeof ApprovalInfoPanel>>();

const { bool: taskApplyVisible, setTrue: setTaskApplyVisible } = useBoolean();
const { loading, startLoading, endLoading } = useLoading();

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();
const title = computed(() => {
  const titles: Record<CommonType.WorkflowTableOperateType, string> = {
    add: '新增请假申请',
    edit: '编辑请假申请',
    detail: '查看请假申请',
    approval: '审批请假申请'
  };
  return titles[props.operateType];
});
const readonly = computed(() => {
  return props.operateType === 'detail' || props.operateType === 'approval';
});

const respLeave = ref<Api.Workflow.Leave>();
const startWorkflowResult = ref<Api.Workflow.StartWorkflowResult>();

type Model = Api.Workflow.LeaveOperateParams & {
  flowCode: Api.Workflow.FlowCodeType;
};

const model: Model = reactive(createDefaultModel());

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

type ModelDetail = Api.Workflow.LeaveDetail & {
  flowCode: Api.Workflow.FlowCodeType;
};

const modelDetail: ModelDetail = reactive(createDefaultModelDetail());

function createDefaultModelDetail(): ModelDetail {
  return {
    flowCode: 'leave1',
    status: null,
    id: null,
    leaveType: null,
    startDate: null,
    endDate: null,
    leaveDays: null,
    remark: ''
  };
}
const showApprovalInfoPanel = computed(() => {
  return modelDetail.status !== 'draft';
});
type StartWorkflowModel = Api.Workflow.StartWorkflowOperateParams;

const startWorkflowModel: StartWorkflowModel = reactive(createDefaultStartWorkflowModel());

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
      // 计算请假天数
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

async function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' || (props.operateType === 'detail' && props.rowData)) {
    Object.assign(model, props.rowData);
    Object.assign(modelDetail, props.rowData);
  } else {
    const { error, data } = await fetchGetLeaveDetail(props.businessId!);
    if (error) {
      window.$message?.error(error.message);
      return;
    }
    Object.assign(modelDetail, data);
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

async function initializeData() {
  if (visible.value) {
    startLoading();
    await handleUpdateModelWhenEdit();
    restoreValidation();

    if (showApprovalInfoPanel.value) {
      approvalInfoPanelRef.value?.initData();
    }
    endLoading();
  }
}

watch(visible, initializeData);

onMounted(initializeData);
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="1300" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NSpin :show="loading">
        <div :class="loading ? 'hidden' : ''">
          <div v-if="!readonly" class="h-full">
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
          </div>
          <div v-else>
            <NDescriptions bordered :column="2" label-placement="left">
              <NDescriptionsItem label="流程类型">
                {{ flowCodeTypeRecord[modelDetail.flowCode] }}
              </NDescriptionsItem>
              <NDescriptionsItem label="请假类型">
                <NTag type="info">{{ leaveTypeRecord[modelDetail.leaveType!] }}</NTag>
              </NDescriptionsItem>
              <NDescriptionsItem label="请假时间">
                {{ `${modelDetail.startDate} 至 ${modelDetail.endDate}` }}
              </NDescriptionsItem>
              <NDescriptionsItem label="请假天数">{{ modelDetail.leaveDays }} 天</NDescriptionsItem>
              <NDescriptionsItem label="请假原因">
                {{ modelDetail.remark || '-' }}
              </NDescriptionsItem>
            </NDescriptions>
            <!-- 审批信息 -->
            <ApprovalInfoPanel v-if="showApprovalInfoPanel" ref="approvalInfoPanelRef" :business-id="modelDetail.id!" />
          </div>
        </div>
      </NSpin>
      <template #footer>
        <div v-if="!readonly">
          <NSpace :size="16">
            <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
            <NButton type="warning" @click="handleSaveDraft">暂存</NButton>
            <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
          </NSpace>
        </div>
      </template>
    </NDrawerContent>
    <WorkflowTaskApplyModal
      v-model:visible="taskApplyVisible"
      :task-id="startWorkflowResult?.taskId!"
      :task-variables="taskVariables"
      @finished="handleTaskFinished"
    />
  </NDrawer>
</template>

<style scoped></style>
