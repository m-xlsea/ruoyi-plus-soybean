<script setup lang="tsx">
import { NDivider, NTag } from 'naive-ui';
import { dataScopeRecord } from '@/constants/business';
import { fetchBatchDeleteRole, fetchGetRoleList, fetchUpdateRoleStatus } from '@/service/api/system/role';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import StatusSwitch from '@/components/custom/status-switch.vue';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';

defineOptions({
  name: 'RoleList'
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
  apiFn: fetchGetRoleList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    roleName: null,
    roleKey: null,
    status: null,
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
      key: 'roleName',
      title: '角色名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleKey',
      title: '角色权限字符串',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleSort',
      title: '显示顺序',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'dataScope',
      title: '数据范围',
      align: 'center',
      minWidth: 120,
      render: row => {
        return <NTag type="info">{dataScopeRecord[row.dataScope]}</NTag>;
      }
    },
    {
      key: 'status',
      title: '角色状态',
      align: 'center',
      minWidth: 120,
      render(row) {
        return (
          <StatusSwitch
            v-model:value={row.status}
            disabled={row.roleId === 1}
            info={row.roleKey}
            onSubmitted={(value, callback) => handleStatusChange(row, value, callback)}
          />
        );
      }
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        if (row.roleId === 1) return null;

        const divider = () => {
          if (!hasAuth('system:role:edit') || !hasAuth('system:role:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:role:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.roleId!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:role:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.roleId!)}
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
  const { error } = await fetchBatchDeleteRole(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(roleId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteRole([roleId]);
  if (error) return;
  onDeleted();
}

async function edit(roleId: CommonType.IdType) {
  handleEdit('roleId', roleId);
}

async function handleExport() {
  download('/system/role/export', searchParams, `角色_${new Date().getTime()}.xlsx`);
}

/** 处理状态切换 */
async function handleStatusChange(
  row: Api.System.Role,
  value: Api.Common.EnableStatus,
  callback: (flag: boolean) => void
) {
  const { error } = await fetchUpdateRoleStatus({
    roleId: row.roleId,
    status: value
  });

  callback(!error);

  if (!error) {
    window.$message?.success('状态修改成功');
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="角色列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:role:add')"
          :show-delete="hasAuth('system:role:remove')"
          :show-export="hasAuth('system:role:export')"
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
        :row-key="row => row.roleId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
