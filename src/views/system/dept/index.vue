<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NDivider } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { fetchBatchDeleteDept, fetchGetDeptList } from '@/service/api/system/dept';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { treeTransform, useNaiveTreeTable, useTableOperate } from '@/hooks/common/table';
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

const searchParams = ref<Api.System.DeptSearchParams>({
  deptName: null,
  status: null,
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
  keyField: 'deptId',
  api: () => fetchGetDeptList(searchParams.value),
  transform: response => treeTransform(response, { idField: 'deptId' }),
  columns: () => [
    {
      key: 'deptName',
      title: $t('page.system.dept.deptName'),
      align: 'center',
      minWidth: 180
    },
    {
      key: 'deptCategory',
      title: $t('page.system.dept.deptCategory'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'orderNum',
      title: $t('page.system.dept.sort'),
      align: 'center',
      minWidth: 60
    },
    {
      key: 'status',
      title: $t('page.system.dept.status'),
      align: 'center',
      minWidth: 120,
      render(row) {
        return <DictTag size="small" value={row.status} dictCode="sys_normal_disable" />;
      }
    },
    {
      key: 'createTime',
      title: $t('page.system.dept.createTime'),
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
              onClick={() => edit(row.deptId)}
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
              onPositiveClick={() => handleDelete(row.deptId)}
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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(
  rows,
  'deptId',
  getData
);

async function handleDelete(deptId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDept([deptId]);
  if (error) return;
  onDeleted();
}

function edit(deptId: CommonType.IdType) {
  handleEdit(deptId);
}

function addInRow(row: Api.System.Dept) {
  editingData.value = jsonClone(row);
  handleAdd();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DeptSearch v-model:model="searchParams" @search="getData" />
    <NCard :title="$t('page.system.dept.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
            <NButton v-if="!isCollapse" :disabled="!data.length" size="small" @click="expandAll">
              <template #icon>
                <icon-quill-expand />
              </template>
              {{ $t('page.system.dept.expandAll') }}
            </NButton>
            <NButton v-if="isCollapse" :disabled="!data.length" size="small" @click="collapseAll">
              <template #icon>
                <icon-quill-collapse />
              </template>
              {{ $t('page.system.dept.collapseAll') }}
            </NButton>
          </template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        v-model:expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :indent="64"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        :row-key="row => row.deptId"
        class="sm:h-full"
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
