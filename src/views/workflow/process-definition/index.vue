<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NDivider, NSwitch, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { workflowPublishStatusRecord } from '@/constants/workflow';
import {
  fetchActiveDefinition,
  fetchBatchDeleteDefinition,
  fetchGetCategoryTree,
  fetchGetUnPublishDefinitionList
} from '@/service/api/workflow';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import DefinitionOperateDrawer from './modules/definition-operate-drawer.vue';
import DefinitionSearch from './modules/definition-search.vue';
import DefinitionImportModal from './modules/definition-import-modal.vue';

defineOptions({
  name: 'DefinitionList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

const { bool: importVisible, setTrue: showImportModal } = useBoolean();

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
  apiFn: fetchGetUnPublishDefinitionList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    flowCode: null,
    flowName: null,
    category: null,
    params: {}
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'flowName',
      title: '流程定义名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'flowCode',
      title: '标识 Key',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'category',
      title: '流程分类',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'version',
      title: '版本号',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'activityStatus',
      title: '激活状态',
      align: 'center',
      minWidth: 120,
      render(row) {
        const {
          loading: activityLoading,
          startLoading: startActivityLoading,
          endLoading: endActivityLoading
        } = useLoading();

        /** 处理状态切换 */
        async function handleStatusChange(value: boolean) {
          window.$dialog?.warning({
            title: '系统提示',
            content: `确定要${value ? '激活' : '挂起'} ${row.flowCode} 吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              startActivityLoading();
              const { error } = await fetchActiveDefinition(row.id, value);
              if (error) return;

              if (!error) row.activityStatus = value ? 1 : 0;

              window.$message?.success($t('page.system.user.statusChangeSuccess'));
              getData();
              endActivityLoading();
            },
            onNegativeClick: () => {}
          });
        }

        return (
          <NSwitch
            v-model:value={row.activityStatus}
            loading={activityLoading.value}
            rubber-band={false}
            checked-value={1}
            unchecked-value={0}
            on-update:value={handleStatusChange}
          />
        );
      }
    },
    {
      key: 'isPublish',
      title: '发布状态',
      align: 'center',
      minWidth: 120,
      render: row => {
        if (row.isPublish === null) {
          return null;
        }

        const tagMap: Record<Api.Workflow.WorkflowPublishStatus, NaiveUI.ThemeColor> = {
          0: 'warning',
          1: 'success',
          9: 'error'
        };

        return <NTag type={tagMap[row.isPublish]}>{workflowPublishStatusRecord[row.isPublish]}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const divider = () => {
          if (!hasAuth('workflow:definition:edit') || !hasAuth('workflow:definition:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('workflow:definition:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.id!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('workflow:definition:remove')) {
            return null;
          }
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
  const { error } = await fetchBatchDeleteDefinition(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(id: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDefinition([id]);
  if (error) return;
  onDeleted();
}

function edit(id: CommonType.IdType) {
  handleEdit('id', id);
}

function handleExport() {
  download('/workflow/definition/export', searchParams, `流程定义_${new Date().getTime()}.xlsx`);
}

function handleDeploy() {
  showImportModal();
}

const { loading: categoryLoading, startLoading: startCategoryLoading, endLoading: endCategoryLoading } = useLoading();
const categoryPattern = ref<string>();
const categoryData = ref<Api.Common.CommonTreeRecord>([]);
const selectedKeys = ref<string[]>([]);

async function getTreeData() {
  startCategoryLoading();
  const { data: tree, error } = await fetchGetCategoryTree();
  if (!error) {
    categoryData.value = tree;
  }
  endCategoryLoading();
}

getTreeData();

function handleClickTree(keys: string[]) {
  searchParams.category = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  categoryPattern.value = undefined;
  getTreeData();
}

const expandedKeys = ref<CommonType.IdType[]>([100]);

const selectable = computed(() => {
  return !loading.value;
});
</script>

<template>
  <TableSiderLayout :sider-title="$t('page.system.dept.title')">
    <template #header-extra>
      <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
        <template #icon>
          <SvgIcon icon="ic:round-refresh" />
        </template>
      </NButton>
    </template>
    <template #sider>
      <NInput v-model:value="categoryPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin class="dept-tree" :show="categoryLoading">
        <NTree
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          block-node
          show-line
          :data="categoryData as []"
          :show-irrelevant-nodes="false"
          :pattern="categoryPattern"
          class="infinite-scroll h-full min-h-200px py-3"
          key-field="id"
          label-field="label"
          virtual-scroll
          :selectable="selectable"
          @update:selected-keys="handleClickTree"
        >
          <template #empty>
            <NEmpty :description="$t('page.system.dept.empty')" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <DefinitionSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
      <NCard title="流程定义列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="hasAuth('workflow:definition:add')"
            :show-delete="hasAuth('workflow:definition:remove')"
            :show-export="hasAuth('workflow:definition:export')"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @export="handleExport"
            @refresh="getData"
          >
            <template #prefix>
              <NButton size="small" ghost @click="handleDeploy">
                <template #icon>
                  <icon-material-symbols:upload-rounded class="text-icon" />
                </template>
                部署流程文件
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
          :row-key="row => row.id"
          :pagination="mobilePagination"
          class="sm:h-full"
        />
        <DefinitionOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          @submitted="getDataByPage"
        />
        <DefinitionImportModal v-model:visible="importVisible" @submitted="getDataByPage" />
      </NCard>
    </div>
  </TableSiderLayout>
</template>

<style scoped></style>
