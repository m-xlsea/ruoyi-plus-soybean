<script setup lang="tsx">
import { NDivider, NTag } from 'naive-ui';
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
import LeaveOperateDrawer from './modules/leave-operate-drawer.vue';
import LeaveSearch from './modules/leave-search.vue';

defineOptions({
  name: 'LeaveList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

useDict('wf_business_status');

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
      minWidth: 100
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
        const divider = () => {
          if (!hasAuth('workflow:leave:edit') || !hasAuth('workflow:leave:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('workflow:leave:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.id!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('workflow:leave:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.id!)}
            />
          );
        };

        return (
          <div class="flex-center gap-8px">
            {editBtn()}
            {divider()}
            {deleteBtn()}
          </div>
        );
      }
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

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

function edit(id: CommonType.IdType) {
  handleEdit('id', id);
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
      <LeaveOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
