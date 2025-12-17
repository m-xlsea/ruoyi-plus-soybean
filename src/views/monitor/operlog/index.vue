<script setup lang="tsx">
import { ref } from 'vue';
import { NButton } from 'naive-ui';
import { fetchBatchDeleteOperLog, fetchCleanOperLog, fetchGetOperLogList } from '@/service/api/monitor/oper-log';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import DictTag from '@/components/custom/dict-tag.vue';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
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

const searchParams = ref<Api.Monitor.OperLogSearchParams>({
  pageNum: 1,
  pageSize: 10,
  title: null,
  businessType: null,
  operName: null,
  operIp: null,
  status: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetOperLogList(searchParams.value),
    transform: response => defaultTransform(response),
    onPaginationParamsChange: params => {
      searchParams.value.pageNum = params.page;
      searchParams.value.pageSize = params.pageSize;
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
        width: 64,
        render: (_, index) => index + 1
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
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:visibility-outline"
                tooltipContent="详情"
                onClick={() => view(row.operId!)}
              />
            );
          };
          return <div class="flex-center gap-8px">{viewBtn()}</div>;
        }
      }
    ]
  });

const { drawerVisible, editingData, handleEdit, checkedRowKeys, onBatchDeleted } = useTableOperate(
  data,
  'operId',
  getData
);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteOperLog(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}
async function view(operId: CommonType.IdType) {
  handleEdit(operId);
}

async function handleExport() {
  download('/monitor/operlog/export', searchParams.value, `操作日志_${new Date().getTime()}.xlsx`);
}

async function handleCleanOperLog() {
  window.$dialog?.error({
    title: '提示',
    content: '是否确认清空所有操作日志数据项?',
    positiveText: '确认清空',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchCleanOperLog();
      if (error) return;
      window.$message?.success('清空成功');
      await getData();
    }
  });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OperLogSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="操作日志列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
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
        >
          <template #prefix>
            <NButton
              v-if="hasAuth('monitor:operlog:remove')"
              type="error"
              ghost
              size="small"
              @click="handleCleanOperLog"
            >
              <template #icon>
                <icon-material-symbols-warning-outline-rounded />
              </template>
              清空
            </NButton>
          </template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
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
