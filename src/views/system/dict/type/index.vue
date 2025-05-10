<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import type { TableDataWithIndex } from '@sa/hooks';
import { fetchBatchDeleteDictType, fetchGetDictTypeList, fetchRefreshCache } from '@/service/api/system/dict';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { emitter } from '../mitt';
import DictTypeOperateDrawer from './modules/dict-type-operate-drawer.vue';
import DictTypeSearch from './modules/dict-type-search.vue';

defineOptions({
  name: 'DictTypeList'
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
  apiFn: fetchGetDictTypeList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    dictName: null,
    dictType: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'dictName',
      title: '字典名称',
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'dictType',
      title: '字典类型',
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
        const divider = () => {
          if (!hasAuth('system:dict:edit') || !hasAuth('system:dict:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:dict:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.dictId!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:dict:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.dictId!)}
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

const lastDictType = ref('');
const rowClick = (row: TableDataWithIndex<Api.System.DictType>) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      if (lastDictType.value === row.dictType) {
        return;
      }
      emitter.emit('rowClick', row.dictType);
      lastDictType.value = row.dictType;
    }
  };
};

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteDictType(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(dictId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDictType([dictId]);
  if (error) return;
  onDeleted();
}

async function edit(dictId: CommonType.IdType) {
  handleEdit('dictId', dictId);
}

async function handleExport() {
  download('/system/dict/type/export', searchParams, `字典类型_${new Date().getTime()}.xlsx`);
}

async function handleRefreshCache() {
  const { error } = await fetchRefreshCache();
  if (error) return;
  window.$message?.success('刷新缓存成功');
  await getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DictTypeSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="字典类型列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:dict:add')"
          :show-delete="hasAuth('system:dict:remove')"
          :show-export="hasAuth('system:dict:export')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        >
          <template #prefix>
            <NButton v-if="hasAuth('system:dict:remove')" type="warning" ghost size="small" @click="handleRefreshCache">
              刷新缓存
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
        :scroll-x="528"
        :loading="loading"
        remote
        :row-key="row => row.dictId"
        :pagination="mobilePagination"
        class="sm:h-full"
        :row-props="rowClick"
      />
      <DictTypeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
