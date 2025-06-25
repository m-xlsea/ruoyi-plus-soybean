<script setup lang="tsx">
import { NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { type TableDataWithIndex } from '@sa/hooks';
import { fetchBatchDeleteTree, fetchGetTreeList } from '@/service/api/demo/tree';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTreeTable, useTreeTableOperate } from '@/hooks/common/tree-table';
import { useDownload } from '@/hooks/business/download';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import TreeOperateDrawer from './modules/tree-operate-drawer.vue';
import TreeSearch from './modules/tree-search.vue';

defineOptions({
  name: 'TreeList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

const {
  columns,
  columnChecks,
  data,
  getData,
  loading,
  searchParams,
  resetSearchParams,
  expandedRowKeys,
  isCollapse,
  expandAll,
  collapseAll
} = useTreeTable({
  apiFn: fetchGetTreeList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    parentId: null,
    deptId: null,
    userId: null,
    treeName: null,
    params: {}
  },
  idField: 'id',
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: '主键',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'parentId',
      title: '父 ID',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'deptId',
      title: '部门 ID',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'userId',
      title: '用户 ID',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'treeName',
      title: '值',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const addBtn = () => {
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:add-2-rounded"
              tooltipContent={$t('common.add')}
              onClick={() => addInRow(row)}
            />
          );
        };

        const editBtn = () => {
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row)}
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
        if (hasAuth('demo:tree:add')) buttons.push(addBtn());
        if (hasAuth('demo:tree:edit')) buttons.push(editBtn());
        if (hasAuth('demo:tree:remove')) buttons.push(deleteBtn());

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
  useTreeTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteTree(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteTree([id]);
  if (error) return;
  onDeleted();
}

async function edit(row: TableDataWithIndex<Api.Demo.Tree>) {
  handleEdit(row);
}

function addInRow(row: TableDataWithIndex<Api.Demo.Tree>) {
  editingData.value = jsonClone(row);
  handleAdd();
}

function handleExport() {
  download('/demo/tree/export', searchParams, `demo_tree_#[[${new Date().getTime()}]]#.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TreeSearch v-model:model="searchParams" :tree-list="data" @reset="resetSearchParams" @search="getData" />
    <NCard title="测试树列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('demo:tree:add')"
          :show-delete="hasAuth('demo:tree:remove')"
          :show-export="false"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        >
          <template #prefix>
            <NButton v-if="!isCollapse" :disabled="!data.length" size="small" @click="expandAll">
              <template #icon>
                <icon-quill:expand />
              </template>
              全部展开
            </NButton>
            <NButton v-if="isCollapse" :disabled="!data.length" size="small" @click="collapseAll">
              <template #icon>
                <icon-quill:collapse />
              </template>
              全部收起
            </NButton>
          </template>
        </TableHeaderOperation>
      </template>
      <DataTable
        v-model:checked-row-keys="checkedRowKeys"
        v-model:expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data="data"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        class="sm:h-full"
      />
      <TreeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :tree-list="data"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
