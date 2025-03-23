<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { computed } from 'vue';
import { fetchBatchDeleteTenant, fetchGetTenantList, fetchSyncTenantDict } from '@/service/api/system/tenant';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { useTable, useTableOperate } from '@/hooks/common/table';
import DictTag from '@/components/custom/dict-tag.vue';
import { useDownload } from '@/hooks/business/download';
import { useDict } from '@/hooks/business/dict';
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
  apiFn: fetchGetTenantList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    tenantId: null,
    contactUserName: null,
    contactPhone: null,
    companyName: null
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
          if (!hasAuth('system:tenant:edit')) {
            return null;
          }
          return (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id!)}>
              {$t('common.edit')}
            </NButton>
          );
        };
        const syncBtn = () => {
          if (!hasAuth('system:tenant:edit')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.id!)}>
              {{
                default: () => `确认同步[${row.companyName}]的套餐吗?`,
                trigger: () => (
                  <NButton type="success" ghost size="small">
                    同步
                  </NButton>
                )
              }}
            </NPopconfirm>
          );
        };
        const deleteBtn = () => {
          if (!hasAuth('system:tenant:delete')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.id!)}>
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
            {syncBtn()}
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
  handleEdit('id', id);
}

async function handleSyncTenantDict() {
  const { error } = await fetchSyncTenantDict();
  if (error) return;
  window.$message?.success('同步租户字典成功');
  await getData();
}

async function handleExport() {
  download('/system/tenant/export', searchParams, `租户列表_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TenantSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="租户列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <NSpace>
          <NPopconfirm @positive-click="() => handleSyncTenantDict()">
            <template #trigger>
              <NButton v-if="isSuperAdmin" size="small">
                <template #icon>
                  <icon-material-symbols:sync-rounded />
                </template>
                同步租户字典
              </NButton>
            </template>
            确认同步租户字典？
          </NPopconfirm>
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
          />
        </NSpace>
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
      <TenantOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
