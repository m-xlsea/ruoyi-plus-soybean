<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { fetchBatchDeleteConfig, fetchGetConfigList } from '@/service/api/system/config';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useAppStore } from '@/store/modules/app';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import DictTag from '@/components/custom/dict-tag.vue';
import ConfigOperateDrawer from './modules/config-operate-drawer.vue';
import ConfigSearch from './modules/config-search.vue';
defineOptions({
  name: 'ConfigList'
});

useDict('sys_yes_no');

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
  apiFn: fetchGetConfigList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    configName: null,
    configKey: null,
    configType: null,
    createTime: null
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
      key: 'configName',
      title: '参数名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'configKey',
      title: '参数键名',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'configValue',
      title: '参数键值',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'configType',
      title: '是否内置',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <DictTag size="small" value={row.configType} dictCode="sys_yes_no" />;
      }
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      minWidth: 120,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: 120,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const editBtn = () => {
          if (!hasAuth('system:config:edit')) {
            return null;
          }
          return (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.configId!)}>
              {$t('common.edit')}
            </NButton>
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:config:remove')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.configId!)}>
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
  const { error } = await fetchBatchDeleteConfig(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(configId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteConfig([configId]);
  if (error) return;
  onDeleted();
}

async function edit(configId: CommonType.IdType) {
  handleEdit('configId', configId);
}

async function handleExport() {
  download('/system/config/export', searchParams, `参数配置_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ConfigSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="参数配置列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:config:add')"
          :show-delete="hasAuth('system:config:remove')"
          :show-export="hasAuth('system:config:export')"
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
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <ConfigOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
