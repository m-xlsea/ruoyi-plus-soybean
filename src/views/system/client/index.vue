<script setup lang="tsx">
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteClient, fetchGetClientList } from '@/service/api/system/client';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import ClientOperateDrawer from './modules/client-operate-drawer.vue';
import ClientSearch from './modules/client-search.vue';

defineOptions({
  name: 'ClientList'
});

useDict('sys_grant_type');
useDict('sys_device_type');
useDict('sys_normal_disable');

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
  apiFn: fetchGetClientList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    clientKey: null,
    clientSecret: null,
    status: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      disabled: row => row.id === 1,
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'clientId',
      title: $t('page.system.client.clientId'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'clientKey',
      title: $t('page.system.client.clientKey'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'clientSecret',
      title: $t('page.system.client.clientSecret'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'grantTypeList',
      title: $t('page.system.client.grantTypeList'),
      align: 'center',
      minWidth: 120,
      render: row => {
        return <DictTag value={row.grantTypeList} dict-code="sys_grant_type" />;
      }
    },
    {
      key: 'deviceType',
      title: $t('page.system.client.deviceType'),
      align: 'center',
      minWidth: 120,
      render: row => {
        return <DictTag value={row.deviceType} dict-code="sys_device_type" />;
      }
    },
    {
      key: 'activeTimeout',
      title: $t('page.system.client.activeTimeout'),
      align: 'center',
      minWidth: 120,
      render: row => {
        return `${row.activeTimeout}${$t('common.second')}`;
      }
    },
    {
      key: 'timeout',
      title: $t('page.system.client.timeout'),
      align: 'center',
      minWidth: 120,
      render: row => {
        return `${row.timeout}${$t('common.second')}`;
      }
    },
    {
      key: 'status',
      title: $t('page.system.client.status'),
      align: 'center',
      minWidth: 120,
      render: row => {
        return <DictTag value={row.status} dict-code="sys_normal_disable" />;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const divider = () => {
          if (!hasAuth('system:client:edit') || !hasAuth('system:client:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:client:edit')) {
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
          if (!hasAuth('system:client:remove')) {
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
              disabled={row.id === 1}
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
  const { error } = await fetchBatchDeleteClient(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteClient([id]);
  if (error) return;
  onDeleted();
}

async function edit(id: CommonType.IdType) {
  handleEdit('id', id);
}

async function handleExport() {
  download('/system/client/export', searchParams, `客户端_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ClientSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.system.client.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:client:add')"
          :show-delete="hasAuth('system:client:remove')"
          :show-export="hasAuth('system:client:export')"
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
      <ClientOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
