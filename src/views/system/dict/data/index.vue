<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { fetchBatchDeleteDictData, fetchGetDictDataList } from '@/service/api/system/dict-data';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useAppStore } from '@/store/modules/app';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import DictTag from '@/components/custom/dict-tag.vue';
import { emitter } from '../mitt';
import DictDataOperateDrawer from './modules/dict-data-operate-drawer.vue';
import DictDataSearch from './modules/dict-data-search.vue';
defineOptions({
  name: 'DictDataList'
});

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
  apiFn: fetchGetDictDataList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    dictLabel: null,
    dictType: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'dictLabel',
      title: '字典标签',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return <DictTag size="small" dictData={row} />;
      }
    },
    {
      key: 'dictValue',
      title: '字典键值',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'dictSort',
      title: '字典排序',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 160,
      render: row => {
        const editBtn = () => {
          if (!hasAuth('system:dict:edit')) {
            return null;
          }
          return (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.dictCode!)}>
              {$t('common.edit')}
            </NButton>
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:dict:remove')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.dictCode!)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    {$t('common.delete')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          );
        };

        return (
          <div class="flex-center gap-8px">
            {editBtn()}
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
  const { error } = await fetchBatchDeleteDictData(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(dictCode: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDictData([dictCode]);
  if (error) return;
  onDeleted();
}

async function edit(dictCode: CommonType.IdType) {
  handleEdit('dictCode', dictCode);
}

async function handleExport() {
  download('/system/dict/data/export', searchParams, `字典数据_${new Date().getTime()}.xlsx`);
}

emitter.on('rowClick', async (value: string) => {
  searchParams.dictType = value;
  await getData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DictDataSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="字典数据列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:dictData:add')"
          :show-delete="hasAuth('system:dictData:remove')"
          :show-export="hasAuth('system:dictData:export')"
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
        :scroll-x="608"
        :loading="loading"
        remote
        :row-key="row => row.dictCode"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <DictDataOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
