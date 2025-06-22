<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton, NDivider, NEmpty, NInput, NRadioButton, NRadioGroup, NTag } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetAllFinishedTask, fetchGetAllWaitingTask } from '@/service/api/workflow/task';
import { fetchGetCategoryTree } from '@/service/api/workflow/category';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import AllTaskWaitingSearch from './modules/all-task-waiting-search.vue';

interface WaitingStatusOption {
  label: string;
  value: boolean;
}

// Create a union type to handle both Task and HisTask
type TaskOrHisTask = Api.Workflow.Task | Api.Workflow.HisTask;

defineOptions({
  name: 'ProcessInstanceList'
});

useDict('wf_business_status');
const appStore = useAppStore();

const waitingStatus = ref<boolean>(true);
const waitingStatusOptions = ref<WaitingStatusOption[]>([
  { label: '待办任务', value: true },
  { label: '已办任务', value: false }
]);

// Common column definitions to reduce duplication
// Explicitly type as TableColumn<TaskOrHisTask> to ensure compatibility with both types
const commonColumns: NaiveUI.TableColumn<TaskOrHisTask>[] = [
  { type: 'selection', align: 'center', width: 50 },
  { key: 'flowName', title: '流程定义名称', align: 'center', width: 120 },
  { key: 'flowCode', title: '流程定义编码', align: 'center', width: 120 },
  { key: 'categoryName', title: '流程分类', align: 'center', width: 120 },
  {
    key: 'version',
    title: '版本号',
    align: 'center',
    width: 120,
    render: row => <NTag type="info">v{row.version}.0</NTag>
  },
  { key: 'nodeName', title: '任务名称', align: 'center', width: 120 },
  { key: 'createByName', title: '申请人', align: 'center', width: 120 },
  { key: 'flowStatus', title: '流程状态', align: 'center', width: 120 }
];

// Waiting task specific columns
const waitingColumns = ref<NaiveUI.TableColumn<Api.Workflow.Task>[]>([
  ...(commonColumns as NaiveUI.TableColumn<Api.Workflow.Task>[]),
  { key: 'assigneeNames', title: '办理人', align: 'center', width: 120 },
  { key: 'createTime', title: '创建时间', align: 'center', width: 120 }
]);

// Finished task specific columns
const finishColumns = ref<NaiveUI.TableColumn<Api.Workflow.HisTask>[]>([
  ...(commonColumns as NaiveUI.TableColumn<Api.Workflow.HisTask>[]),
  { key: 'approveName', title: '办理人', align: 'center', width: 120 },
  { key: 'flowTaskStatus', title: '任务状态', align: 'center', width: 120 },
  { key: 'createTime', title: '创建时间', align: 'center', width: 120 }
]);

// Operation column with optimized render function
const operateColumns = ref<NaiveUI.TableColumn<TaskOrHisTask>[]>([
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    fixed: 'right',
    width: 120,
    render: () => {
      const buttons = [
        <ButtonIcon text type="info" icon="material-symbols:visibility-outline" tooltipContent="查看" />
      ];

      if (waitingStatus.value) {
        buttons.push(<ButtonIcon text type="info" icon="material-symbols:edit-document" tooltipContent="流程干预" />);
      }

      return (
        <div class="flex-center gap-1px">
          {buttons.map((btn, index) => (index > 0 ? [<NDivider vertical />, btn] : btn))}
        </div>
      );
    }
  }
]);

const {
  columns,
  reloadColumns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
  updateApiFn
} = useTable({
  apiFn: fetchGetAllWaitingTask,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    category: null,
    flowName: null,
    flowCode: null,
    nodeName: null,
    createByIds: null
  },
  columns: () => {
    const baseColumns = waitingStatus.value ? waitingColumns.value : finishColumns.value;
    return [...baseColumns, ...operateColumns.value] as NaiveUI.TableColumn<TaskOrHisTask>[];
  }
});

const { checkedRowKeys, editingData: _editingData, handleEdit: _handleEdit } = useTableOperate(data, getData);

watch(waitingStatus, async () => {
  const newApiFn = waitingStatus.value ? fetchGetAllWaitingTask : fetchGetAllFinishedTask;
  // @ts-expect-error - This is a workaround for the type issue
  updateApiFn(newApiFn);
  await getDataByPage();
  reloadColumns();
});

// Category tree handling
const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const categoryPattern = ref<string>();
const categoryData = ref<Api.Common.CommonTreeRecord>([]);
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<CommonType.IdType[]>(['100']);

const selectable = computed(() => !loading.value);

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetCategoryTree();
  if (!error) {
    categoryData.value = tree;
  }
  endTreeLoading();
}

function handleClickTree(keys: string[]) {
  searchParams.category = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  categoryPattern.value = undefined;
  getTreeData();
}

function handleResetSearch() {
  resetSearchParams();
  selectedKeys.value = [];
}

getTreeData();
</script>

<template>
  <TableSiderLayout sider-title="流程分类列表">
    <template #header-extra>
      <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
        <template #icon>
          <SvgIcon icon="ic:round-refresh" />
        </template>
      </NButton>
    </template>
    <template #sider>
      <NInput v-model:value="categoryPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin class="category-tree" :show="treeLoading">
        <NTree
          v-model:selected-keys="selectedKeys"
          v-model:expanded-keys="expandedKeys"
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
            <NEmpty description="暂无分类信息" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <AllTaskWaitingSearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
      <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header>
          <NSpace>
            <NRadioGroup v-model:value="waitingStatus" on-up size="small">
              <NRadioButton
                v-for="(status, index) in waitingStatusOptions"
                :key="index"
                :value="status.value"
                :label="status.label"
              />
            </NRadioGroup>
          </NSpace>
        </template>
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="false"
            :show-delete="false"
            :show-export="false"
            @refresh="getData"
          >
            <template #prefix></template>
          </TableHeaderOperation>
        </template>
        <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :scroll-x="1405"
          :loading="loading"
          remote
          :row-key="row => row.id"
          :pagination="mobilePagination"
          class="sm:h-full"
        />
      </NCard>
    </div>
  </TableSiderLayout>
</template>
