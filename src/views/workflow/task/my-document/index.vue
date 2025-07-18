<script setup lang="tsx">
import { computed, ref, shallowRef } from 'vue';
import { NButton, NDivider, NEmpty, NInput, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { workflowActivityStatusRecord } from '@/constants/workflow';
import { fetchBatchDeleteInstance, fetchCancelProcessApply, fetchGetMyDocument } from '@/service/api/workflow/instance';
import { fetchGetCategoryTree } from '@/service/api/workflow/category';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { loadDynamicComponent } from '@/utils/common';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import MyDocumentSearch from './modules/my-document-search.vue';

defineOptions({
  name: 'MyDocumentList'
});

useDict('wf_business_status');
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
  apiFn: fetchGetMyDocument,
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
      width: 80,
      render: row => {
        return <NTag type="info">v{row.version}.0</NTag>;
      }
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
      title: '状态',
      key: 'activityStatus',
      align: 'center',
      width: 80,
      render(row) {
        return (
          <NTag type={row.activityStatus === 0 ? 'warning' : 'success'}>
            {workflowActivityStatusRecord[row.activityStatus]}
          </NTag>
        );
      }
    },
    {
      title: '启动时间',
      key: 'createTime',
      align: 'center',
      width: 100
    },
    {
      title: '操作',
      key: 'operate',
      align: 'center',
      fixed: 'right',
      width: 100,
      render(row) {
        const buttons = [];

        buttons.push(
          <ButtonIcon
            text
            type="info"
            icon="material-symbols:visibility-outline"
            tooltipContent="查看"
            onClick={() => handleOpen(row, 'detail')}
          />
        );
        const showEditAndDelete =
          row.flowStatus === 'draft' || row.flowStatus === 'cancel' || row.flowStatus === 'back';
        if (showEditAndDelete) {
          buttons.push(
            <ButtonIcon
              text
              type="info"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent="编辑"
              onClick={() => handleOpen(row, 'edit')}
            />
          );
        }

        if (showEditAndDelete) {
          buttons.push(
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row)}
            />
          );
        }

        if (row.flowStatus === 'waiting') {
          buttons.push(
            <ButtonIcon
              text
              type="error"
              showPopconfirmIcon={false}
              icon="material-symbols:cancel-outline-rounded"
              tooltipContent="撤销"
              popconfirmContent="确认撤销此流程申请？"
              onPositiveClick={() => handleCancelProcessApply(row.businessId)}
            />
          );
        }

        return (
          <div class="flex-center gap-1px">
            {buttons.map((btn, index) => (index > 0 ? [<NDivider vertical />, btn] : btn))}
          </div>
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
const modules = import.meta.glob('@/components/workflow/**/*.vue');
const businessId = ref<CommonType.IdType>();
const operateType = ref<CommonType.WorkflowTableOperateType>();

async function handleOpen(row: Api.Workflow.Instance, type: 'edit' | 'detail') {
  operateType.value = type;
  businessId.value = row.businessId;
  const formPath = row.formPath;
  if (!formPath) return;
  dynamicComponent.value = await loadDynamicComponent(modules, formPath);
  showViewDrawer();
}

async function handleDelete(row: Api.Workflow.Instance) {
  const { error } = await fetchBatchDeleteInstance([row.id]);
  if (error) return;
  window.$message?.success('删除成功');
  getData();
}

async function handleCancelProcessApply(id: CommonType.IdType) {
  const { error } = await fetchCancelProcessApply({ businessId: id, message: '申请人撤销流程！' });
  if (error) return;
  window.$message?.success('撤销成功');
  getData();
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
      <MyDocumentSearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
      <NCard title="我发起的" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
          :visible="viewVisible"
          :operate-type="operateType"
          :business-id="businessId"
          @submitted="getData"
        />
      </NCard>
    </div>
  </TableSiderLayout>
</template>
