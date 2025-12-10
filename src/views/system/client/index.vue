<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteClient, fetchGetClientList, fetchUpdateClientStatus } from '@/service/api/system/client';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import StatusSwitch from '@/components/custom/status-switch.vue';
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

const searchParams = ref<Api.System.ClientSearchParams>({
  pageNum: 1,
  pageSize: 10,
  // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
  // the value can not be undefined, otherwise the property in Form will not be reactive
  clientKey: null,
  clientSecret: null,
  status: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetClientList(searchParams.value),
    transform: response => defaultTransform(response),
    onPaginationParamsChange: params => {
      searchParams.value.pageNum = params.page;
      searchParams.value.pageSize = params.pageSize;
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
        width: 64,
        render: (_, index) => index + 1
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
        title: $t('page.system.user.status'),
        align: 'center',
        width: 80,
        render(row) {
          return (
            <StatusSwitch
              v-model:value={row.status}
              disabled={row.id === 1}
              info={row.clientId}
              onSubmitted={(value, callback) => handleStatusChange(row, value, callback)}
            />
          );
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
  useTableOperate(data, 'id', getData);

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
  handleEdit(id);
}

async function handleExport() {
  download('/system/client/export', searchParams.value, `客户端_${new Date().getTime()}.xlsx`);
}

/** 处理状态切换 */
async function handleStatusChange(
  row: Api.System.Client,
  value: Api.Common.EnableStatus,
  callback: (flag: boolean) => void
) {
  const { error } = await fetchUpdateClientStatus({
    clientId: row.clientId,
    status: value
  });

  callback(!error);

  if (!error) {
    window.$message?.success($t('page.system.user.statusChangeSuccess'));
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ClientSearch v-model:model="searchParams" @search="getDataByPage" />
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
        :scroll-x="scrollX"
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
