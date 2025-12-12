<script setup lang="tsx">
import { ref } from 'vue';
import type { DataTableSortState } from 'naive-ui';
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteDemo, fetchGetDemoList } from '@/service/api/demo/demo';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import DemoOperateDrawer from './modules/demo-operate-drawer.vue';
import DemoSearch from './modules/demo-search.vue';

defineOptions({
  name: 'DemoList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

const searchParams = ref<Api.Demo.DemoSearchParams>({
  pageNum: 1,
  pageSize: 10,
  deptId: null,
  userId: null,
  testKey: null,
  value: null,
  orderByColumn: null,
  isAsc: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetDemoList(searchParams.value),
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
        key: 'deptId',
        title: '部门 ID',
        align: 'center',
        minWidth: 120,
        sorter: true
      },
      {
        key: 'userId',
        title: '用户 ID',
        align: 'center',
        minWidth: 120,
        sorter: true
      },
      {
        key: 'orderNum',
        title: '排序号',
        align: 'center',
        minWidth: 120,
        sorter: true
      },
      {
        key: 'testKey',
        title: 'Key 键',
        align: 'center',
        minWidth: 120,
        sorter: true
      },
      {
        key: 'value',
        title: '值',
        align: 'center',
        minWidth: 120,
        sorter: true
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => {
          const divider = () => {
            if (!hasAuth('demo:demo:edit') || !hasAuth('demo:demo:remove')) {
              return null;
            }
            return <NDivider vertical />;
          };

          const editBtn = () => {
            if (!hasAuth('demo:demo:edit')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.id)}
              />
            );
          };

          const deleteBtn = () => {
            if (!hasAuth('demo:demo:remove')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.id)}
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
  useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteDemo(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDemo([id]);
  if (error) return;
  onDeleted();
}

function edit(id: CommonType.IdType) {
  handleEdit(id);
}

function handleExport() {
  download('/demo/demo/export', searchParams.value, `测试单表_${new Date().getTime()}.xlsx`);
}

function handleUpdateSorter(sorters: DataTableSortState) {
  if (!sorters.order) {
    searchParams.value.orderByColumn = null;
    searchParams.value.isAsc = null;
  } else {
    searchParams.value.orderByColumn = sorters.columnKey as keyof Api.System.Oss;
    searchParams.value.isAsc = sorters.order === 'ascend' ? 'asc' : 'desc';
  }
  getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DemoSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="测试单表列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('demo:demo:add')"
          :show-delete="hasAuth('demo:demo:remove')"
          :show-export="hasAuth('demo:demo:export')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        />
      </template>
      <DataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
        @update:sorter="handleUpdateSorter"
      />
      <DemoOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
