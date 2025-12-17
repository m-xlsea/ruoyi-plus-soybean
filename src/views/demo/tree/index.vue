<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { fetchBatchDeleteTree, fetchGetTreeList } from '@/service/api/demo/tree';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { treeTransform, useNaiveTreeTable, useTableOperate } from '@/hooks/common/table';
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

const searchParams = ref<Api.Demo.TreeSearchParams>({
  parentId: null,
  deptId: null,
  userId: null,
  treeName: null,
  params: {}
});

const {
  columns,
  columnChecks,
  data,
  rows,
  getData,
  loading,
  expandedRowKeys,
  isCollapse,
  expandAll,
  collapseAll,
  scrollX
} = useNaiveTreeTable({
  keyField: 'id',
  api: () => fetchGetTreeList(searchParams.value),
  transform: response => treeTransform(response),
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
      title: '树节点名',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 150,
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
              onClick={() => edit(row.id)}
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
              onPositiveClick={() => handleDelete(row.id)}
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
  useTableOperate(rows, 'id', getData);

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

function edit(id: CommonType.IdType) {
  handleEdit(id);
}

function addInRow(row: Api.Demo.Tree) {
  editingData.value = jsonClone(row);
  handleAdd();
}

function handleExport() {
  download('/demo/tree/export', searchParams.value, `测试树表_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TreeSearch v-model:model="searchParams" :tree-list="data" @search="getData" />
    <NCard title="测试树表列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
                <icon-quill-expand />
              </template>
              全部展开
            </NButton>
            <NButton v-if="isCollapse" :disabled="!data.length" size="small" @click="collapseAll">
              <template #icon>
                <icon-quill-collapse />
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
        :indent="64"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
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
