<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NDivider } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
import {
  fetchBatchDeleteGenTable,
  fetchGenCode,
  fetchGetGenDataNames,
  fetchGetGenTableList,
  fetchSynchGenDbList
} from '@/service/api/tool';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDownload } from '@/hooks/business/download';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import GenTableSearch from './modules/gen-table-search.vue';
import GenTableImportDrawer from './modules/gen-table-import-drawer.vue';
import GenTableOperateDrawer from './modules/gen-table-operate-drawer.vue';
import GenTablePreviewDrawer from './modules/gen-table-preview-drawer.vue';

const { hasAuth } = useAuth();
const appStore = useAppStore();
const { zip } = useDownload();
const { bool: importVisible, setTrue: openImportVisible } = useBoolean();
const { bool: previewVisible, setTrue: openPreviewVisible } = useBoolean();

const searchParams = ref<Api.Tool.GenTableSearchParams>({
  pageNum: 1,
  pageSize: 10,
  dataName: null,
  tableName: null,
  tableComment: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetGenTableList(searchParams.value),
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
        key: 'dataName',
        title: '数据源',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'tableName',
        title: '表名称',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'tableComment',
        title: '表描述',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'className',
        title: '实体',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'createTime',
        title: '创建时间',
        align: 'center',
        minWidth: 150
      },
      {
        key: 'updateTime',
        title: '更新时间',
        align: 'center',
        minWidth: 150
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 300,
        render: row => {
          const previewBtn = () => {
            return (
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:visibility-outline"
                tooltipContent="预览"
                onClick={() => handlePreview(row.tableId!)}
              />
            );
          };

          const editBtn = () => {
            return (
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.tableId!)}
              />
            );
          };

          const refreshBtn = () => {
            return (
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:sync-outline"
                tooltipContent="同步"
                onClick={() => refresh(row.tableId!)}
              />
            );
          };

          const genCodeBtn = () => {
            return (
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:download-rounded"
                tooltipContent="生成代码"
                onClick={() => handleGenCode(row)}
              />
            );
          };

          const deleteBtn = () => {
            return (
              <ButtonIcon
                type="error"
                text
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.tableId!)}
              />
            );
          };

          const buttons = [];
          if (hasAuth('tool:gen:preview')) buttons.push(previewBtn());
          if (hasAuth('tool:gen:edit')) buttons.push(editBtn());
          if (hasAuth('tool:gen:refresh')) buttons.push(refreshBtn());
          if (hasAuth('tool:gen:genCode')) buttons.push(genCodeBtn());
          if (hasAuth('tool:gen:delete')) buttons.push(deleteBtn());

          return (
            <div class="flex-center gap-8px">
              {buttons.map((btn, index) => (
                <>
                  {index !== 0 && <NDivider vertical />}
                  {btn}
                </>
              ))}
            </div>
          );
        }
      }
    ]
  });

const {
  drawerVisible,
  editingData,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'tableId', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteGenTable(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteGenTable([id]);
  if (error) return;
  onDeleted();
}

function edit(id: CommonType.IdType) {
  handleEdit(id);
}

async function refresh(id: CommonType.IdType) {
  // request
  const { error } = await fetchSynchGenDbList(id);
  if (error) return;
  window.$message?.success('同步成功');
}

function handleImport() {
  openImportVisible();
}

function handlePreview(id: CommonType.IdType) {
  const findItem = data.value.find(item => item.tableId === id) || null;
  editingData.value = jsonClone(findItem);
  openPreviewVisible();
}

async function handleGenCode(row?: Api.Tool.GenTable) {
  const tableIds = row?.tableId || checkedRowKeys.value.join(',');
  if (!tableIds || tableIds === '') {
    window.$message?.error('请选择要生成的数据');
    return;
  }
  // request
  if (row?.genType === '1') {
    const { error } = await fetchGenCode(row.tableId!);
    if (error) return;
    window.$message?.success('生成成功');
  } else {
    zip(`/tool/gen/batchGenCode?tableIdStr=${tableIds}`, `RuoYi-${row?.tableId ? `${row.className}` : Date.now()}.zip`);
  }
}

const dataNameOptions = ref<CommonType.Option[]>([]);

async function getDataNames() {
  const { error, data: dataNames } = await fetchGetGenDataNames();
  if (error) return;
  dataNameOptions.value = dataNames.map(item => ({ label: item, value: item }));
}

getDataNames();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
    <GenTableSearch v-model:model="searchParams" :options="dataNameOptions" @search="getDataByPage" />
    <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
    <NCard title="代码生成" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="false"
          @delete="handleBatchDelete"
          @refresh="getData"
        >
          <template #prefix>
            <NButton
              :disabled="checkedRowKeys.length === 0"
              size="small"
              ghost
              type="primary"
              @click="() => handleGenCode()"
            >
              <template #icon>
                <icon-material-symbols-download-rounded class="text-icon" />
              </template>
              生成代码
            </NButton>
            <NButton size="small" ghost type="primary" @click="handleImport">
              <template #icon>
                <icon-material-symbols-upload-rounded class="text-icon" />
              </template>
              导入
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
        :row-key="row => row.tableId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <GenTableImportDrawer v-model:visible="importVisible" :options="dataNameOptions" @submitted="getData" />
      <GenTableOperateDrawer v-model:visible="drawerVisible" :row-data="editingData" @submitted="getData" />
      <GenTablePreviewDrawer
        v-model:visible="previewVisible"
        :row-data="editingData"
        @submitted="() => handleGenCode(editingData!)"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
