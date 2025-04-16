<script setup lang="tsx">
import { NButton } from 'naive-ui';
import { fetchBatchDeleteOperLog, fetchCleanOperLog, fetchGetOperLogList } from '@/service/api/monitor/oper-log';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useAppStore } from '@/store/modules/app';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import DictTag from '@/components/custom/dict-tag.vue';
import { useDict } from '@/hooks/business/dict';
import OperLogViewDrawer from './modules/oper-log-view-drawer.vue';
import OperLogSearch from './modules/oper-log-search.vue';
defineOptions({
  name: 'OperLogList'
});

useDict('sys_common_status');
useDict('sys_oper_type');

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

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
  apiFn: fetchGetOperLogList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    title: null,
    businessType: null,
    operName: null,
    operIp: null,
    status: null,
    operTime: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'title',
      title: '系统模块',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'businessType',
      title: '操作类型',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <DictTag size="small" value={row.businessType} dictCode="sys_oper_type" />;
      }
    },
    {
      key: 'operName',
      title: '操作人员',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operIp',
      title: '操作IP',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operLocation',
      title: '操作地点',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'status',
      title: '操作状态',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <DictTag size="small" value={row.status} dictCode="sys_common_status" />;
      }
    },
    {
      key: 'operTime',
      title: '操作时间',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'costTime',
      title: '消耗时间',
      align: 'center',
      minWidth: 120,
      render(row) {
        return `${row.costTime} ms`;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const viewBtn = () => {
          return (
            <NButton type="primary" ghost size="small" onClick={() => view(row.operId!)}>
              详情
            </NButton>
          );
        };
        return <div class="flex-center gap-8px">{viewBtn()}</div>;
      }
    }
  ]
});

const { drawerVisible, editingData, handleEdit, checkedRowKeys, onBatchDeleted } = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteOperLog(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}
async function view(operId: CommonType.IdType) {
  handleEdit('operId', operId);
}

async function handleExport() {
  download('/monitor/operlog/export', searchParams, `操作日志_${new Date().getTime()}.xlsx`);
}

async function handleCleanOperLog() {
  const { error } = await fetchCleanOperLog();
  if (error) return;
  window.$message?.success('清理成功');
  await getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OperLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="操作日志列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <NSpace>
          <NPopconfirm v-if="hasAuth('monitor:operlog:remove')" @positive-click="() => handleCleanOperLog()">
            <template #trigger>
              <NButton type="warning" ghost size="small">
                <template #icon>
                  <icon-ic-round-delete class="text-icon" />
                </template>
                清空
              </NButton>
            </template>
            确认清空操作日志？
          </NPopconfirm>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="false"
            :show-delete="hasAuth('monitor:operlog:remove')"
            :show-export="hasAuth('monitor:operlog:export')"
            @delete="handleBatchDelete"
            @export="handleExport"
            @refresh="getData"
          />
        </NSpace>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.operId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperLogViewDrawer v-model:visible="drawerVisible" :row-data="editingData" />
    </NCard>
  </div>
</template>

<style scoped></style>
