<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NButton, NDivider } from 'naive-ui';
import {
  fetchBatchDeleteTenant,
  fetchGetTenantList,
  fetchSyncTenantConfig,
  fetchSyncTenantDict,
  fetchSyncTenantPackage
} from '@/service/api/system/tenant';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useAuth } from '@/hooks/business/auth';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDownload } from '@/hooks/business/download';
import { useDict } from '@/hooks/business/dict';
import DictTag from '@/components/custom/dict-tag.vue';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import TenantOperateDrawer from './modules/tenant-operate-drawer.vue';
import TenantSearch from './modules/tenant-search.vue';

defineOptions({
  name: 'TenantList'
});

useDict('sys_normal_disable');

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();
const { userInfo } = useAuthStore();

const isSuperAdmin = computed(() => {
  return userInfo.user?.userId === 1;
});

const searchParams = ref<Api.System.TenantSearchParams>({
  pageNum: 1,
  pageSize: 10,
  tenantId: null,
  contactUserName: null,
  contactPhone: null,
  companyName: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetTenantList(searchParams.value),
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
        key: 'tenantId',
        title: '租户编号',
        align: 'center',
        minWidth: 80
      },
      {
        key: 'contactUserName',
        title: '联系人',
        align: 'center',
        minWidth: 80
      },
      {
        key: 'contactPhone',
        title: '联系电话',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'companyName',
        title: '企业名称',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'expireTime',
        title: '过期时间',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'status',
        title: '租户状态',
        align: 'center',
        minWidth: 120,
        render(row) {
          return <DictTag size="small" value={row.status} dictCode="sys_normal_disable" />;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 180,
        render: row => {
          if (row.tenantId === '000000') return null;

          const editBtn = () => {
            return (
              <ButtonIcon
                type="primary"
                text
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.id!)}
              />
            );
          };

          const syncBtn = () => {
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:sync-outline"
                tooltipContent="同步套餐"
                popconfirmContent={`确认同步[${row.companyName}]的套餐吗?`}
                onPositiveClick={() => handleSyncTenantPackage(row)}
              />
            );
          };

          const deleteBtn = () => {
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.id!)}
              />
            );
          };

          const buttons = [];

          if (hasAuth('system:tenant:edit')) buttons.push(editBtn());
          if (hasAuth('system:tenant:edit')) buttons.push(syncBtn());
          if (hasAuth('system:tenant:delete')) buttons.push(deleteBtn());

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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteTenant(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteTenant([id]);
  if (error) return;
  onDeleted();
}

async function edit(id: CommonType.IdType) {
  handleEdit(id);
}

async function handleSyncTenantDict() {
  window.$dialog?.warning({
    title: '同步租户字典',
    content: '确认同步租户字典吗?',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchSyncTenantDict();
      if (error) return;
      window.$message?.success('同步租户字典成功');
      await getData();
    }
  });
}

async function handleSyncTenantConfig() {
  window.$dialog?.warning({
    title: '同步租户参数配置',
    content: '确认同步租户参数配置吗?',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchSyncTenantConfig();
      if (error) return;
      window.$message?.success('同步租户参数配置成功');
      await getData();
    }
  });
}

async function handleSyncTenantPackage(row: Api.System.Tenant) {
  const params: Api.System.TenantPackageSyncParams = {
    tenantId: row.tenantId,
    packageId: row.packageId
  };
  const { error } = await fetchSyncTenantPackage(params);
  if (error) return;
  window.$message?.success('同步租户套餐成功');
  await getData();
}

async function handleExport() {
  download('/system/tenant/export', searchParams.value, `租户列表_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TenantSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="租户列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:tenant:add')"
          :show-delete="hasAuth('system:tenant:delete')"
          :show-export="hasAuth('system:tenant:export')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        >
          <template #prefix>
            <NButton v-if="isSuperAdmin" ghost size="small" @click="handleSyncTenantDict">
              <template #icon>
                <icon-material-symbols-sync-outline />
              </template>
              同步租户字典
            </NButton>
            <NButton v-if="isSuperAdmin" ghost size="small" @click="handleSyncTenantConfig">
              <template #icon>
                <icon-material-symbols-sync-outline />
              </template>
              同步租户参数配置
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
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <TenantOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped>
:deep(.n-card-header__main) {
  min-width: 36px !important;
}
</style>
