<script setup lang="tsx">
import { computed, ref, shallowRef, watch } from 'vue';
import { NButton, NDivider, NEmpty, NInput, NRadioButton, NRadioGroup, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { fetchGetAllFinishedTask, fetchGetAllWaitingTask, fetchTaskAssignee } from '@/service/api/workflow/task';
import { fetchGetCategoryTree } from '@/service/api/workflow/category';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { loadDynamicComponent } from '@/utils/common';
import TagGroup from '@/components/custom/tag-group.vue';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import AllTaskWaitingSearch from './modules/all-task-waiting-search.vue';

interface WaitingStatusOption {
  label: string;
  value: boolean;
}

defineOptions({
  name: 'AllTaskWaitingList'
});

useDict('wf_business_status');
useDict('wf_task_status');
const appStore = useAppStore();
const { bool: viewVisible, setTrue: showViewDrawer } = useBoolean();
const { bool: interveneVisible, setTrue: showInterveneDrawer } = useBoolean();
const { bool: urgeVisible, setTrue: showUrgeModal } = useBoolean();
const { bool: assigneeVisible, setTrue: showAssigneeModal } = useBoolean();
const dynamicComponent = shallowRef();

const waitingStatus = ref<boolean>(true);
const waitingStatusOptions = ref<WaitingStatusOption[]>([
  { label: '待办任务', value: true },
  { label: '已办任务', value: false }
]);

const commonColumns: NaiveUI.TableColumn<Api.Workflow.TaskOrHisTask>[] = [
  { type: 'selection', align: 'center', width: 50 },
  { key: 'businessCode', title: '业务编码', align: 'center', width: 120 },
  { key: 'businessTitle', title: '业务名称', align: 'center', width: 120 },
  { key: 'flowName', title: '流程定义名称', align: 'center', width: 120 },
  { key: 'flowCode', title: '流程定义编码', align: 'center', width: 120 },
  {
    key: 'categoryName',
    title: '流程分类',
    align: 'center',
    width: 120,
    render: row => <NTag>{row.categoryName}</NTag>
  },
  {
    key: 'version',
    title: '版本号',
    align: 'center',
    width: 120,
    render: row => <NTag type="info">v{row.version}.0</NTag>
  },
  { key: 'nodeName', title: '任务名称', align: 'center', width: 120 },
  { key: 'createByName', title: '申请人', align: 'center', width: 120 },
  {
    key: 'flowStatus',
    title: '流程状态',
    align: 'center',
    width: 120,
    render: row => <DictTag size="small" value={row.flowStatus} dict-code="wf_business_status" />
  }
];

const waitingColumns = ref<NaiveUI.TableColumn<Api.Workflow.Task>[]>([
  ...(commonColumns as NaiveUI.TableColumn<Api.Workflow.Task>[]),
  {
    key: 'assigneeNames',
    title: '办理人',
    align: 'center',
    width: 120,
    render: row => <TagGroup value={row.assigneeNames} />
  },
  { key: 'createTime', title: '创建时间', align: 'center', width: 120 }
]);

const finishColumns = ref<NaiveUI.TableColumn<Api.Workflow.HisTask>[]>([
  ...(commonColumns as NaiveUI.TableColumn<Api.Workflow.HisTask>[]),
  {
    key: 'approveName',
    title: '办理人',
    align: 'center',
    width: 120,
    render: row => <NTag type="info">{row.approveName}</NTag>
  },
  {
    key: 'flowTaskStatus',
    title: '任务状态',
    align: 'center',
    width: 120,
    render: row => <DictTag size="small" value={row.flowTaskStatus} dict-code="wf_task_status" />
  },
  { key: 'createTime', title: '创建时间', align: 'center', width: 120 }
]);

const operateColumns = ref<NaiveUI.TableColumn<Api.Workflow.TaskOrHisTask>[]>([
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    fixed: 'right',
    width: 100,
    render: row => {
      const buttons = [
        <ButtonIcon
          text
          type="info"
          icon="material-symbols:visibility-outline"
          tooltipContent="查看"
          onClick={() => handleView(row)}
        />
      ];

      if (waitingStatus.value && row.flowStatus !== 'draft') {
        buttons.push(
          <ButtonIcon
            text
            type="info"
            icon="material-symbols:edit-document"
            tooltipContent="流程干预"
            onClick={() => handleIntervene(row as Api.Workflow.Task)}
          />
        );
      }

      return (
        <div class="flex-center gap-8px">
          {buttons.map((btn, index) => (index > 0 ? [<NDivider vertical />, btn] : btn))}
        </div>
      );
    }
  }
]);

const searchParams = ref<Api.Workflow.TaskSearchParams>({
  pageNum: 1,
  pageSize: 10,
  category: null,
  flowName: null,
  flowCode: null,
  nodeName: null,
  createByIds: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX, reloadColumns } =
  useNaivePaginatedTable({
    api: () => {
      return waitingStatus.value
        ? fetchGetAllWaitingTask(searchParams.value)
        : fetchGetAllFinishedTask(searchParams.value);
    },
    transform: response => defaultTransform(response),
    onPaginationParamsChange: params => {
      searchParams.value.pageNum = params.page;
      searchParams.value.pageSize = params.pageSize;
    },
    columns: () => {
      const baseColumns = waitingStatus.value ? waitingColumns.value : finishColumns.value;
      return [...baseColumns, ...operateColumns.value] as NaiveUI.TableColumn<Api.Workflow.TaskOrHisTask>[];
    }
  });

const { checkedRowKeys } = useTableOperate(data, 'id', getData);

watch(waitingStatus, async () => {
  await getDataByPage();
  reloadColumns();
});

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

getTreeData();

function handleClickTree(keys: string[]) {
  searchParams.value.category = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  categoryPattern.value = undefined;
  getTreeData();
}

function handleResetSearch() {
  selectedKeys.value = [];
  getDataByPage();
}
const modules = import.meta.glob('@/components/workflow/**/*.vue');
const businessId = ref<CommonType.IdType>();

async function handleView(row: Api.Workflow.TaskOrHisTask) {
  dynamicComponent.value = null;
  viewVisible.value = false;
  businessId.value = row.businessId;
  const formPath = row.formPath;
  if (!formPath) return;
  dynamicComponent.value = await loadDynamicComponent(modules, formPath);
  setTimeout(() => {
    showViewDrawer();
  }, 300);
}

const taskId = ref<CommonType.IdType>('');
const assigneeIds = ref<CommonType.IdType[]>([]);
const assigneeNames = ref<string[]>([]);
function handleIntervene(row: Api.Workflow.Task) {
  taskId.value = row.id;
  assigneeIds.value = row.assigneeIds?.split(',') || [];
  assigneeNames.value = row.assigneeNames?.split(',') || [];
  showInterveneDrawer();
}

async function handleAssigneeConfirm(userIds: CommonType.IdType[]) {
  const { error } = await fetchTaskAssignee(checkedRowKeys.value, userIds[0]);
  if (error) return;
  window.$message?.success('修改办理人成功');
  assigneeVisible.value = false;
  await getData();
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
      <AllTaskWaitingSearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
      <NCard :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
            <template #prefix>
              <NButton
                v-if="waitingStatus"
                :disabled="checkedRowKeys.length === 0"
                size="small"
                type="warning"
                ghost
                @click="showAssigneeModal"
              >
                <template #icon>
                  <icon-material-symbols-drive-file-rename-outline-outline class="text-icon" />
                </template>
                修改办理人
              </NButton>
              <NButton
                v-if="waitingStatus"
                :disabled="checkedRowKeys.length === 0"
                size="small"
                type="success"
                ghost
                @click="showUrgeModal"
              >
                <template #icon>
                  <SvgIcon local-icon="bell" class="text-16px" />
                </template>
                催办
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
          :scroll-x="scrollX"
          :loading="loading"
          remote
          :row-key="row => row.id"
          :pagination="mobilePagination"
          class="sm:h-full"
        />
        <component :is="dynamicComponent" :visible="viewVisible" operate-type="detail" :business-id="businessId" />
        <FlowInterveneModal
          v-model:visible="interveneVisible"
          :task-id="taskId"
          :assignee-ids="assigneeIds"
          :assignee-names="assigneeNames"
          @refresh="getData"
        />
        <!-- 催办 -->
        <FlowUrgeModal v-model:visible="urgeVisible" :task-ids="checkedRowKeys" @submit="getData" />
        <!-- 修改办理人 -->
        <UserSelectModal v-model:visible="assigneeVisible" @confirm="handleAssigneeConfirm" />
      </NCard>
    </div>
  </TableSiderLayout>
</template>

<style scoped>
:deep(.n-card-header__main) {
  min-width: 170px !important;
}
</style>
