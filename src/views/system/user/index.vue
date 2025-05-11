<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NDivider } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { fetchBatchDeleteUser, fetchGetDeptTree, fetchGetUserList, fetchUpdateUserStatus } from '@/service/api/system';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import StatusSwitch from '@/components/custom/status-switch.vue';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserImportModal from './modules/user-import-modal.vue';
import UserSearch from './modules/user-search.vue';

defineOptions({
  name: 'UserList'
});

useDict('sys_user_sex');

const { hasAuth } = useAuth();
const appStore = useAppStore();
const { download } = useDownload();

const { bool: importVisible, setTrue: openImportModal } = useBoolean();

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
        return (
          <StatusSwitch
            v-model:value={row.status}
            disabled={row.userId === 1}
            info={row.userName}
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
        const divider = () => {
          if (!hasAuth('system:user:edit') || !hasAuth('system:user:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:user:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.userId!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:user:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.userId!)}
            />
          );
        };

        return (
          <div class="flex-center gap-6px">
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

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const deptPattern = ref<string>();
const deptData = ref<Api.Common.CommonTreeRecord>([]);

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetDeptTree();
  if (!error) {
    deptData.value = tree;
  }
  endTreeLoading();
}

getTreeData();

function handleClickTree(keys: string[]) {
  searchParams.deptId = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  deptPattern.value = undefined;
  getTreeData();
}

function handleImport() {
  openImportModal();
}

/** 处理状态切换 */
async function handleStatusChange(
  row: Api.System.User,
  value: Api.Common.EnableStatus,
  callback: (flag: boolean) => void
) {
  const { error } = await fetchUpdateUserStatus({
    userId: row.userId,
    status: value
  });

  callback(!error);

  if (!error) {
    window.$message?.success('状态修改成功');
    getData();
  }
}

function handleExport() {
  download('/system/user/export', searchParams, `用户列表_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <TableSiderLayout sider-title="部门列表">
    <template #header-extra>
      <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
        <template #icon>
          <SvgIcon icon="ic:round-refresh" />
        </template>
      </NButton>
    </template>
    <template #sider>
      <NInput v-model:value="deptPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin class="dept-tree" :show="treeLoading">
        <NTree
          block-node
          show-line
          :data="deptData as []"
          :default-expanded-keys="deptData?.length ? [deptData[0].id!] : []"
          :show-irrelevant-nodes="false"
          :pattern="deptPattern"
          class="infinite-scroll h-full min-h-200px py-3"
          key-field="id"
          label-field="label"
          virtual-scroll
          @update:selected-keys="handleClickTree"
        >
          <template #empty>
            <NEmpty description="暂无部门信息" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
      <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
      <NCard title="用户列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="hasAuth('system:user:add')"
            :show-delete="hasAuth('system:user:remove')"
            :show-export="hasAuth('system:user:export')"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @export="handleExport"
            @refresh="getData"
          >
            <template #after>
              <NButton v-if="hasAuth('system:user:import')" size="small" ghost @click="handleImport">
                <template #icon>
                  <icon-material-symbols:upload-rounded class="text-icon" />
                </template>
                导入
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
          :scroll-x="962"
          :loading="loading"
          remote
          :row-key="row => row.userId"
          :pagination="mobilePagination"
          class="h-full"
        />
        <UserImportModal v-model:visible="importVisible" @submitted="getDataByPage" />
        <UserOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          :dept-data="deptData"
          :dept-id="searchParams.deptId"
          @submitted="getDataByPage"
        />
      </NCard>
    </div>
  </TableSiderLayout>
</template>

<style scoped lang="scss">
.dept-tree {
  .n-button {
    --n-padding: 8px !important;
  }

  :deep(.n-tree__empty) {
    height: 100%;
    justify-content: center;
  }

  :deep(.n-spin-content) {
    height: 100%;
  }

  :deep(.infinite-scroll) {
    height: calc(100vh - 228px - var(--calc-footer-height, 0px)) !important;
    max-height: calc(100vh - 228px - var(--calc-footer-height, 0px)) !important;
  }

  @media screen and (max-width: 1024px) {
    :deep(.infinite-scroll) {
      height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
      max-height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
    }
  }

  :deep(.n-tree-node) {
    height: 25px;
  }

  :deep(.n-tree-node-switcher) {
    height: 25px;
  }

  :deep(.n-tree-node-switcher__icon) {
    font-size: 16px !important;
    height: 16px !important;
    width: 16px !important;
  }
}

:deep(.n-data-table-wrapper),
:deep(.n-data-table-base-table),
:deep(.n-data-table-base-table-body) {
  height: 100%;
}

@media screen and (max-width: 800px) {
  :deep(.n-data-table-base-table-body) {
    max-height: calc(100vh - 400px - var(--calc-footer-height, 0px));
  }
}

@media screen and (max-width: 802px) {
  :deep(.n-data-table-base-table-body) {
    max-height: calc(100vh - 473px - var(--calc-footer-height, 0px));
  }
}

:deep(.n-card-header__main) {
  min-width: 69px !important;
}
</style>
