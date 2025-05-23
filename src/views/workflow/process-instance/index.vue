<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton, NDivider, NEmpty, NInput, NRadioButton, NRadioGroup, NSpin, NTag } from 'naive-ui';
import { workflowActivityStatusRecord } from '@/constants/workflow';
import { fetchGetCategoryTree } from '@/service/api/workflow/category';
import {
  fetchBatchDeleteProcessInstance,
  fetchGetFinishProcessInstanceList,
  fetchGetRunningProcessInstanceList
} from '@/service/api/workflow/instance';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import useLoading from '@/hooks/common/loading';
import DictTag from '@/components/custom/dict-tag.vue';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import ProcessInstanceSearch from './modules/process-instance-search.vue';

interface RunningStatusOption {
  label: string;
  value: boolean;
}

defineOptions({
  name: 'ProcessInstanceList'
});

useDict('wf_business_status');
const appStore = useAppStore();

const runningStatus = ref<boolean>(true);
const runningStatusOptions = ref<RunningStatusOption[]>([
  {
    label: '运行中',
    value: true
  },
  {
    label: '已完成',
    value: false
  }
]);

// 基础列
const baseColumns = ref<NaiveUI.TableColumn<Api.Workflow.ProcessInstance>[]>([
  {
    type: 'selection',
    align: 'center',
    width: 48
  },
  {
    key: 'flowName',
    title: '流程定义名称',
    align: 'center',
    width: 120
  },
  {
    key: 'nodeName',
    title: '任务名称',
    align: 'center',
    minWidth: 120
  },
  {
    key: 'flowCode',
    title: '流程定义编码',
    align: 'center',
    minWidth: 120
  },
  {
    key: 'categoryName',
    title: '流程分类',
    align: 'center',
    minWidth: 120
  },
  {
    key: 'createByName',
    title: '申请人',
    align: 'center',
    minWidth: 120
  },
  {
    key: 'version',
    title: '版本号',
    align: 'center',
    width: 80
  },
  {
    key: 'activityStatus',
    title: '状态',
    align: 'center',
    minWidth: 100,
    render(row) {
      return (
        <NTag type={row.activityStatus === 0 ? 'warning' : 'success'}>
          {workflowActivityStatusRecord[row.activityStatus]}
        </NTag>
      );
    }
  },
  {
    key: 'flowStatus',
    title: '流程状态',
    align: 'center',
    minWidth: 100,
    render(row) {
      return <DictTag value={row.flowStatus} dictCode="wf_business_status" />;
    }
  },
  {
    key: 'createTime',
    title: '启动时间',
    align: 'center',
    minWidth: 150
  }
]);

// 完成列
const finishColumns = ref<NaiveUI.TableColumn<Api.Workflow.ProcessInstance>[]>([
  {
    key: 'updateTime',
    title: '结束时间',
    align: 'center',
    minWidth: 150
  }
]);

// 操作列
const operateColumns = ref<NaiveUI.TableColumn<Api.Workflow.ProcessInstance>[]>([
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    fixed: 'right',
    width: 150,
    render: row => {
      const showAll = runningStatus.value;

      return (
        <div class="flex-center gap-1px">
          {showAll && (
            <>
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:cancel-outline-rounded"
                tooltipContent="作废流程"
                onClick={() => edit(row.id!)}
              />
              <NDivider vertical />
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.id!)}
              />
              <NDivider vertical />
            </>
          )}
          <ButtonIcon text type="info" icon="material-symbols:visibility-outline" tooltipContent="流程预览" />
          <NDivider vertical />
          <ButtonIcon text type="info" icon="material-symbols:variable-insert" tooltipContent="流程变量" />
        </div>
      );
    }
  }
]);

const {
  columns,
  columnChecks,
  reloadColumns,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
  updateApiFn
} = useTable({
  apiFn: fetchGetRunningProcessInstanceList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    category: null,
    flowName: null,
    flowCode: null,
    nodeName: null,
    createByIds: null
  },
  columns: () =>
    runningStatus.value
      ? [...baseColumns.value, ...operateColumns.value]
      : [...baseColumns.value, ...finishColumns.value, ...operateColumns.value]
});

const { handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);
// 监听运行状态变化
watch(runningStatus, async () => {
  const newApiFn = runningStatus.value ? fetchGetRunningProcessInstanceList : fetchGetFinishProcessInstanceList;
  updateApiFn(newApiFn);
  reloadColumns();
  await getDataByPage();
});

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const categoryPattern = ref<string>();
const categoryData = ref<Api.Common.CommonTreeRecord>([]);
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<CommonType.IdType[]>(['100']);

const selectable = computed(() => {
  return !loading.value;
});

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetCategoryTree();
  if (!error) {
    categoryData.value = tree;
  }
  endTreeLoading();
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

function handleResetSearch() {
  resetSearchParams();
  selectedKeys.value = [];
}

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteProcessInstance(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(instanceId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteProcessInstance([instanceId]);
  if (error) return;
  onDeleted();
}

async function edit(instanceId: CommonType.IdType) {
  handleEdit('id', instanceId);
}
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
      <ProcessInstanceSearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
      <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header>
          <NSpace>
            <NRadioGroup v-model:value="runningStatus" on-up size="small">
              <NRadioButton
                v-for="(status, index) in runningStatusOptions"
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
            :show-delete="true"
            :show-export="false"
            @delete="handleBatchDelete"
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
          :scroll-x="1078"
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

<style scoped lang="scss">
.category-tree {
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
