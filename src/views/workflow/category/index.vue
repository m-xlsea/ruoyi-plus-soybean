<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { fetchDeleteCategory, fetchGetCategoryList } from '@/service/api/workflow';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { treeTransform, useNaiveTreeTable, useTableOperate } from '@/hooks/common/table';
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

const searchParams = ref<Api.Workflow.WorkflowCategorySearchParams>({
  categoryName: null,
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
  keyField: 'categoryId',
  api: () => fetchGetCategoryList(searchParams.value),
  transform: response => treeTransform(response, { idField: 'categoryId' }),
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
              onClick={() => edit(row.categoryId)}
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
              onPositiveClick={() => handleDelete(row.categoryId)}
            />
          );
        };

        const buttons = [];
        if (hasAuth('workflow:category:add')) buttons.push(addBtn());
        if (hasAuth('workflow:category:edit')) buttons.push(editBtn());
        if (hasAuth('workflow:category:remove')) buttons.push(deleteBtn());

        return (
          <div class="flex-center gap-4px">
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

const { drawerVisible, operateType, editingData, checkedRowKeys, handleAdd, handleEdit, onDeleted } = useTableOperate(
  rows,
  'categoryId',
  getData
);

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchDeleteCategory(id);
  if (error) return;
  onDeleted();
}

async function edit(categoryId: CommonType.IdType) {
  handleEdit(categoryId);
}

async function addInRow(row: Api.Workflow.WorkflowCategory) {
  editingData.value = jsonClone(row);
  handleAdd();
}

async function handleAddOperate() {
  editingData.value = null;
  handleAdd();
}
function handleExport() {
  download('/workflow/category/export', searchParams, `流程分类_#[[${new Date().getTime()}]]#.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <WorkflowCategorySearch v-model:model="searchParams" @search="getData" />
    <NCard title="流程分类列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :show-add="hasAuth('workflow:category:add')"
          :show-delete="false"
          :show-export="false"
          @add="handleAddOperate"
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
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        v-model:expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :indent="64"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        remote
        :row-key="row => row.categoryId"
        class="sm:h-full"
      />
      <WorkflowCategoryOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
