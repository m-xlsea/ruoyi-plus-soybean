<script setup lang="tsx">
import { NButton, NPopconfirm, NTooltip } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { ref } from 'vue';
import { fetchBatchDeleteGenTable, fetchGetGenDataNames, fetchGetGenTableList } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import ButtonIcon from '@/components/custom/button-icon.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import GenTableSearch from './modules/gen-table-search.vue';
import TableImportDrawer from './modules/table-import-drawer.vue';
import GenTableOperateDrawer from './modules/gen-table-operate-drawer.vue';

const appStore = useAppStore();
const { bool: importVisible, setTrue: openImportVisible } = useBoolean();

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
  apiFn: fetchGetGenTableList,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    dataName: null,
    tableName: null,
    tableComment: null,
    params: {}
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
      width: 180,
      render: row => (
        <div class="flex-center gap-16px">
          <ButtonIcon type="primary" text icon="ep:view" tooltipContent="预览" onClick={() => edit(row.tableId!)} />
          <ButtonIcon
            type="primary"
            text
            icon="ep:edit"
            tooltipContent={$t('common.edit')}
            onClick={() => edit(row.tableId!)}
          />
          <ButtonIcon type="primary" text icon="ep:refresh" tooltipContent="同步" onClick={() => edit(row.tableId!)} />
          <ButtonIcon
            type="primary"
            text
            icon="ep:download"
            tooltipContent="生成代码"
            onClick={() => edit(row.tableId!)}
          />
          <NTooltip placement="bottom">
            {{
              trigger: () => (
                <NPopconfirm onPositiveClick={() => handleDelete(row.tableId!)}>
                  {{
                    default: () => $t('common.confirmDelete'),
                    trigger: () => (
                      <NButton class="h-36px text-icon" type="error" text>
                        {{
                          default: () => (
                            <div class="flex-center gap-8px">
                              <SvgIcon icon="ep:delete" />
                            </div>
                          )
                        }}
                      </NButton>
                    )
                  }}
                </NPopconfirm>
              ),
              default: () => <>{$t('common.delete')}</>
            }}
          </NTooltip>
        </div>
      )
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
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteGenTable(checkedRowKeys.value);
  if (error) return;
  window.$message?.success('删除成功');

  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteGenTable([id]);
  if (error) return;
  window.$message?.success('删除成功');

  onDeleted();
}

function edit(id: CommonType.IdType) {
  handleEdit('tableId', id);
}

function handleImport() {
  openImportVisible();
}

function handleGenCode() {}

const dataNameOptions = ref<CommonType.Option[]>([]);

async function getDataNames() {
  const { error, data: dataNames } = await fetchGetGenDataNames();
  if (error) return;
  dataNameOptions.value = dataNames.map(item => ({ label: item, value: item }));
}

getDataNames();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <GenTableSearch
      v-model:model="searchParams"
      :options="dataNameOptions"
      @reset="resetSearchParams"
      @search="getDataByPage"
    />
    <TableColumnCheckAlert v-model:columns="checkedRowKeys" />
    <NCard title="代码生成" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
            <NButton :disabled="checkedRowKeys.length === 0" size="small" ghost type="primary" @click="handleGenCode">
              <template #icon>
                <icon-ic-round-download class="text-icon" />
              </template>
              生成代码
            </NButton>
            <NButton size="small" ghost type="primary" @click="handleImport">
              <template #icon>
                <icon-ic-round-upload class="text-icon" />
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
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.tableId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <TableImportDrawer v-model:visible="importVisible" :options="dataNameOptions" @submitted="getDataByPage" />
      <GenTableOperateDrawer v-model:visible="drawerVisible" :row-data="editingData" @submitted="getDataByPage" />
    </NCard>
  </div>
</template>

<style scoped></style>
