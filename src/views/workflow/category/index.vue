<script setup lang="tsx">
import { NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { type TableDataWithIndex } from '@sa/hooks';
import { fetchDeleteCategory, fetchGetCategoryList } from '@/service/api/workflow';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTreeTable, useTreeTableOperate } from '@/hooks/common/tree-table';
import { useDownload } from '@/hooks/business/download';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import WorkflowCategoryOperateDrawer from './modules/category-operate-drawer.vue';
import WorkflowCategorySearch from './modules/category-search.vue';

defineOptions({
  name: 'WorkflowCategoryList'
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
  apiFn: fetchGetCategoryList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    categoryName: null
  },
  idField: 'categoryId',
  columns: () => [
    {
      key: 'categoryName',
      title: '分类名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'orderNum',
      title: '显示顺序',
      align: 'center',
      minWidth: 120
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
              onPositiveClick={() => handleDelete(row.categoryId!)}
            />
          );
        };

        const buttons = [];
        if (hasAuth('workflow:category:add')) buttons.push(addBtn());
        if (hasAuth('workflow:category:edit')) buttons.push(editBtn());
        if (hasAuth('workflow:category:remove')) buttons.push(deleteBtn());

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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } =
  useTreeTableOperate(data, getData);

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchDeleteCategory(id);
  if (error) return;
  onDeleted();
}

async function edit(row: TableDataWithIndex<Api.Workflow.WorkflowCategory>) {
  handleEdit(row);
}

function addInRow(row: TableDataWithIndex<Api.Workflow.WorkflowCategory>) {
  editingData.value = jsonClone(row);
  handleAdd();
}

function handleExport() {
  download('/workflow/category/export', searchParams, `流程分类_#[[${new Date().getTime()}]]#.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <WorkflowCategorySearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard title="流程分类列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :show-add="hasAuth('workflow:category:add')"
          :show-delete="false"
          :show-export="false"
          @add="handleAdd"
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
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        v-model:expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :indent="32"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.categoryId"
        class="sm:h-full"
      />
      <WorkflowCategoryOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :category-tree-list="data"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
