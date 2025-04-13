<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { ref } from 'vue';
import { fetchBatchDeletePost, fetchGetPostList } from '@/service/api/system/post';
import { fetchGetDeptTree } from '@/service/api/system';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useAppStore } from '@/store/modules/app';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import DictTag from '@/components/custom/dict-tag.vue';
import PostOperateDrawer from './modules/post-operate-drawer.vue';
import PostSearch from './modules/post-search.vue';

defineOptions({
  name: 'PostList'
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
  apiFn: fetchGetPostList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    postCode: null,
    postName: null,
    status: null
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
      key: 'postCode',
      title: '岗位编码',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'postCategory',
      title: '类别编码',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'postName',
      title: '岗位名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'postSort',
      title: '显示顺序',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <DictTag size="small" value={row.status} dictCode="sys_normal_disable" />;
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
          if (!hasAuth('system:post:edit')) {
            return null;
          }
          return (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.postId!)}>
              {$t('common.edit')}
            </NButton>
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:post:remove')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.postId!)}>
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
  const { error } = await fetchBatchDeletePost(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(postId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeletePost([postId]);
  if (error) return;
  onDeleted();
}

async function edit(postId: CommonType.IdType) {
  handleEdit('postId', postId);
}

async function handleExport() {
  download('/system/post/export', searchParams, `岗位信息_${new Date().getTime()}.xlsx`);
}

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const deptPattern = ref<string>();
const deptData = ref<Api.Common.CommonTreeRecord>([]);
const selectedKeys = ref<string[]>([]);

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
  selectedKeys.value = keys;
  searchParams.belongDeptId = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  deptPattern.value = undefined;
  selectedKeys.value = [];
  searchParams.belongDeptId = null;
  getTreeData();
  getDataByPage();
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
          v-model:selected-keys="selectedKeys"
          block-node
          show-line
          :data="deptData as []"
          :default-expanded-keys="deptData?.length ? [deptData[0].id!] : []"
          :show-irrelevant-nodes="false"
          :pattern="deptPattern"
          block-line
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
      <PostSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
      <NCard title="岗位信息列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="hasAuth('system:post:add')"
            :show-delete="hasAuth('system:post:remove')"
            :show-export="hasAuth('system:post:export')"
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
          :row-key="row => row.postId"
          :pagination="mobilePagination"
          class="sm:h-full"
        />
        <PostOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          :dept-data="deptData"
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
    height: 33px;
  }

  :deep(.n-tree-node-switcher) {
    height: 33px;
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
