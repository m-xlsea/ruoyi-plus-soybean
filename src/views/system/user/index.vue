<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { fetchBatchDeleteUser, fetchGetUserList } from '@/service/api/system';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import DictTag from '@/components/custom/dict-tag.vue';
import { useDict } from '@/hooks/business/dict';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

defineOptions({
  name: 'UserList'
});

useDict('sys_user_sex');
useDict('sys_normal_disable');

const appStore = useAppStore();

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
  apiFn: fetchGetUserList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    deptId: null,
    userName: null,
    nickName: null,
    phonenumber: null,
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
      key: 'userName',
      title: '用户名称',
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'nickName',
      title: '用户昵称',
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'deptName',
      title: '部门',
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'phonenumber',
      title: '手机号码',
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 80,
      render(row) {
        return <DictTag size="small" value={row.status} dict-code="sys_normal_disable" />;
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
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.userId!)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.userId!)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteUser(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(userId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteUser([userId]);
  if (error) return;
  onDeleted();
}

async function edit(userId: CommonType.IdType) {
  handleEdit('userId', userId);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="用户列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
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
        :row-key="row => row.userId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
