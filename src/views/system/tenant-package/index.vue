<script setup lang="tsx">
import { defineOptions, ref } from 'vue';
import { NDivider } from 'naive-ui';
import {
  fetchBatchDeleteTenantPackage,
  fetchGetTenantPackageList,
  fetchUpdateTenantPackageStatus
} from '@/service/api/system/tenant-package';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import StatusSwitch from '@/components/custom/status-switch.vue';
import TenantPackageSearch from './modules/tenant-package-search.vue';
import TenantPackageOperateDrawer from './modules/tenant-package-operate-drawer.vue';

defineOptions({
  name: 'TenantPackageList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

useDict('sys_normal_disable', false);

const searchParams = ref<Api.System.TenantPackageSearchParams>({
  pageNum: 1,
  pageSize: 10,
  packageName: null,
  status: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetTenantPackageList(searchParams.value),
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
        width: 64
      },
      {
        key: 'packageName',
        title: $t('page.system.tenantPackage.packageName'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'status',
        title: $t('page.system.tenantPackage.status'),
        align: 'center',
        minWidth: 120,
        render: row => {
          return (
            <StatusSwitch
              v-model:value={row.status}
              info={row.packageName}
              onSubmitted={(value, callback) => handleStatusChange(row, value, callback)}
            />
          );
        }
      },
      {
        key: 'remark',
        title: $t('page.system.tenantPackage.remark'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => {
          const divider = () => {
            if (!hasAuth('system:tenantPackage:edit') || !hasAuth('system:tenantPackage:remove')) {
              return null;
            }
            return <NDivider vertical />;
          };

          const editBtn = () => {
            if (!hasAuth('system:tenantPackage:edit')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.packageId!)}
              />
            );
          };

          const deleteBtn = () => {
            if (!hasAuth('system:tenantPackage:remove')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.packageId!)}
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
  useTableOperate(data, 'packageId', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteTenantPackage(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(packageId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteTenantPackage([packageId]);
  if (error) return;
  onDeleted();
}

function edit(packageId: CommonType.IdType) {
  handleEdit(packageId);
}

function handleExport() {
  download(
    '/system/tenant/package/export',
    searchParams,
    `${$t('page.system.tenantPackage.title')}_${new Date().getTime()}.xlsx`
  );
}

/** 处理状态切换 */
async function handleStatusChange(
  row: Api.System.TenantPackage,
  value: Api.Common.EnableStatus,
  callback: (flag: boolean) => void
) {
  const { error } = await fetchUpdateTenantPackageStatus({
    packageId: row.packageId,
    status: value
  });

  callback(!error);

  if (!error) {
    window.$message?.success($t('page.system.tenantPackage.statusChangeSuccess'));
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TenantPackageSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.system.tenantPackage.title')"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:tenantPackage:add')"
          :show-delete="hasAuth('system:tenantPackage:remove')"
          :show-export="hasAuth('system:tenantPackage:export')"
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
        :row-key="row => row.packageId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <TenantPackageOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
