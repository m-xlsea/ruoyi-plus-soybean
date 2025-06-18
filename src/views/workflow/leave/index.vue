<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider, NTag } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { leaveTypeRecord } from '@/constants/workflow';
import { fetchBatchDeleteLeave, fetchGetLeaveList } from '@/service/api/workflow';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import LeaveEdit from '@/components/custom/work-flow/leave-edit/index.vue';
import LeaveSearch from './modules/leave-search.vue';

defineOptions({
  name: 'LeaveList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

useDict('wf_business_status');

const workflowTableOperateType = ref<CommonType.WorkflowTableOperateType>('add');
const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetLeaveList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    leaveDays: null,
    params: {}
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'leaveType',
      title: '请假类型',
      align: 'center',
      minWidth: 100,
      render: row => {
        return (
          <NTag size="small" type="info">
            {leaveTypeRecord[row.leaveType]}
          </NTag>
        );
      }
    },
    {
      key: 'startDate',
      title: '开始时间',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'endDate',
      title: '结束时间',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'leaveDays',
      title: '请假天数',
      align: 'center',
      minWidth: 100,
      render: row => {
        return `${row.leaveDays} 天`;
      }
    },
    {
      key: 'remark',
      title: '请假原因',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 100,
      render: row => {
        return <DictTag size="small" value={row.status} dictCode="wf_business_status" />;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const buttons = [];

        const showEdit =
          hasAuth('workflow:leave:edit') &&
          (row.status === 'draft' || row.status === 'cancel' || row.status === 'back');

        const showDelete =
          hasAuth('workflow:leave:remove') &&
          (row.status === 'draft' || row.status === 'cancel' || row.status === 'back');

        const showCancel = row.status === 'waiting';
        if (hasAuth('workflow:leave:query')) {
          buttons.push(
            <ButtonIcon
              text
              type="info"
              icon="material-symbols:visibility-outline"
              tooltipContent="查看"
              onClick={() => view(row.id!)}
            />
          );
        }

        if (showEdit) {
          buttons.push(
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.id!)}
            />
          );
        }

        if (showCancel) {
          buttons.push(
            <ButtonIcon
              text
              type="warning"
              icon="material-symbols:cancel-outline"
              tooltipContent="撤销"
              popconfirmContent="确定要撤销该申请吗？"
              onPositiveClick={() => {}}
            />
          );
        }

        if (showDelete) {
          buttons.push(
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.id!)}
            />
          );
        }

        const buttonWithDividers = buttons.flatMap((btn, index) => {
          if (index === 0) return [btn];
          return [<NDivider vertical />, btn];
        });

        return <div class="flex-center gap-4px">{buttonWithDividers}</div>;
      }
    }
  ]
});

const { drawerVisible, openDrawer, editingData, checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(
  data,
  getData
);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteLeave(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteLeave([id]);
  if (error) return;
  onDeleted();
}

function handleAdd() {
  workflowTableOperateType.value = 'add';
  openDrawer();
}

function cloneAndOpenDrawer(id: CommonType.IdType) {
  const findItem = data.value.find(item => item.id === id) || null;
  editingData.value = jsonClone(findItem);
  openDrawer();
}

function edit(id: CommonType.IdType) {
  workflowTableOperateType.value = 'edit';
  cloneAndOpenDrawer(id);
}

function view(id: CommonType.IdType) {
  workflowTableOperateType.value = 'detail';
  cloneAndOpenDrawer(id);
}

function handleExport() {
  download('/workflow/leave/export', searchParams, `请假申请_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LeaveSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="请假申请列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('workflow:leave:add')"
          :show-delete="hasAuth('workflow:leave:remove')"
          :show-export="hasAuth('workflow:leave:export')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="778"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <LeaveEdit
        v-model:visible="drawerVisible"
        :operate-type="workflowTableOperateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
