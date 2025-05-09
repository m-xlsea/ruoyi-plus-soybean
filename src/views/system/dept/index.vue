<script setup lang="tsx">
import { NButton, NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import type { TableDataWithIndex } from '@sa/hooks';
import { fetchBatchDeleteDept, fetchGetDeptList } from '@/service/api/system/dept';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTreeTable, useTreeTableOperate } from '@/hooks/common/tree-table';
import { useDict } from '@/hooks/business/dict';
import DictTag from '@/components/custom/dict-tag.vue';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import DeptOperateDrawer from './modules/dept-operate-drawer.vue';
import DeptSearch from './modules/dept-search.vue';

defineOptions({
  name: 'DeptList'
});

useDict('sys_normal_disable');

const appStore = useAppStore();
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
  expandAll,
  collapseAll
} = useTreeTable({
  apiFn: fetchGetDeptList,
  apiParams: {
    deptName: null,
    status: null
  },
  idField: 'deptId',
  columns: () => [
    {
      key: 'deptName',
      title: '部门名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'deptCategory',
      title: '类别编码',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'orderNum',
      title: '排序',
      align: 'center',
      minWidth: 60
    },
    {
      key: 'status',
      title: '部门状态',
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
              onPositiveClick={() => handleDelete(row.deptId!)}
            />
          );
        };

        const buttons = [];
        if (hasAuth('system:dept:add')) buttons.push(addBtn());
        if (hasAuth('system:dept:edit')) buttons.push(editBtn());
        if (hasAuth('system:dept:remove')) buttons.push(deleteBtn());

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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTreeTableOperate(
  data,
  getData
);

async function handleDelete(deptId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDept([deptId]);
  if (error) return;
  onDeleted();
}

async function edit(row: TableDataWithIndex<Api.System.Dept>) {
  handleEdit(row);
}

async function addInRow(row: TableDataWithIndex<Api.System.Dept>) {
  handleAdd();
  editingData.value = jsonClone(row);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DeptSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard title="部门列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :show-add="hasAuth('system:dept:add')"
          :show-delete="false"
          @add="handleAdd"
          @refresh="getData"
        >
          <template #prefix>
            <NButton size="small" @click="expandAll">展开</NButton>
            <NButton size="small" @click="collapseAll">收起</NButton>
          </template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        :indent="28"
        :row-key="row => row.deptId"
        :expanded-row-keys="expandedRowKeys"
        class="sm:h-full"
        @update:expanded-row-keys="keys => (expandedRowKeys = keys)"
      />
      <DeptOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
