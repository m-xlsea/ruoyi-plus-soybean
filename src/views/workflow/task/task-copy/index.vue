<script setup lang="tsx">
import { computed, ref, shallowRef } from 'vue';
import { NButton, NEmpty, NInput, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { fetchGetCategoryTree } from '@/service/api/workflow/category';
import { fetchGetCopyTask } from '@/service/api/workflow/task';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { loadDynamicComponent } from '@/utils/common';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import TaskCopySearch from './modules/task-copy-search.vue';

defineOptions({
  name: 'TaskCopyList'
});

useDict('wf_business_status');
useDict('wf_task_status');
const appStore = useAppStore();
const { bool: viewVisible, setTrue: showViewDrawer } = useBoolean();
const dynamicComponent = shallowRef();

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
  apiFn: fetchGetCopyTask,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    category: null,
    flowName: null,
    flowCode: null,
    nodeName: null,
    createByIds: null
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      title: '流程定义名称',
      key: 'flowName',
      align: 'center',
      width: 120
    },
    {
      title: '流程定义编码',
      key: 'flowCode',
      align: 'center',
      width: 100
    },
    {
      title: '流程分类',
      key: 'categoryName',
      align: 'center',
      width: 80,
      render: row => {
        return <NTag>{row.categoryName}</NTag>;
      }
    },
    {
      title: '版本号',
      key: 'version',
      align: 'center',
      width: 100,
      render: row => <NTag type="info">v{row.version}.0</NTag>
    },
    {
      title: '任务名称',
      key: 'nodeName',
      align: 'center',
      width: 100
    },
    {
      title: '流程状态',
      key: 'flowStatus',
      align: 'center',
      width: 80,
      render(row) {
        return <DictTag value={row.flowStatus} dict-code="wf_business_status" />;
      }
    },
    {
      title: '申请人',
      key: 'createByName',
      align: 'center',
      width: 100
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      width: 120
    },
    {
      title: '操作',
      key: 'operate',
      align: 'center',
      fixed: 'right',
      width: 50,
      render(row) {
        return (
          <ButtonIcon
            text
            type="primary"
            icon="material-symbols:visibility-outline"
            tooltipContent="查看"
            onClick={() => handleView(row)}
          />
        );
      }
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);

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
const modules = import.meta.glob('@/components/custom/workflow/**/*.vue');
const businessId = ref<CommonType.IdType>();
const taskId = ref<CommonType.IdType>();

async function handleView(row: Api.Workflow.Task) {
  businessId.value = row.businessId;
  taskId.value = row.id;
  const formPath = row.formPath;
  if (!formPath) return;
  dynamicComponent.value = await loadDynamicComponent(modules, formPath);
  showViewDrawer();
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
      <TaskCopySearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
      <NCard title="我的抄送" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :show-add="false"
            :show-delete="false"
            :show-export="false"
            @refresh="getData"
          ></TableHeaderOperation>
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
        <component
          :is="dynamicComponent"
          v-if="dynamicComponent"
          :visible="viewVisible"
          operate-type="detail"
          :business-id="businessId"
          :task-id="taskId"
          @submitted="getData"
        />
      </NCard>
    </div>
  </TableSiderLayout>
</template>
