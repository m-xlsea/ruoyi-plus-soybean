<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NDivider, NSwitch, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { type TableDataWithIndex } from '@sa/hooks';
import { workflowPublishStatusRecord } from '@/constants/workflow';
import {
  fetchActiveDefinition,
  fetchBatchDeleteDefinition,
  fetchCopyDefinition,
  fetchGetCategoryTree,
  fetchGetDefinitionList,
  fetchGetUnPublishDefinitionList,
  fetchPublishDefinition
} from '@/service/api/workflow';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import DefinitionOperateDrawer from './modules/definition-operate-drawer.vue';
import DefinitionSearch from './modules/definition-search.vue';
import DefinitionImportModal from './modules/definition-import-modal.vue';

defineOptions({
  name: 'DefinitionList'
});

interface IsPublishOption {
  label: string;
  value: boolean;
}

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();
const { routerPushByKey } = useRouterPush();

const { bool: importVisible, setTrue: showImportModal } = useBoolean();
const isPublish = ref<boolean>(true);
const isPublishOptions = ref<IsPublishOption[]>([
  {
    label: '已发布',
    value: true
  },
  {
    label: '未发布',
    value: false
  }
]);
const {
  columns,
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
  apiFn: fetchGetDefinitionList,
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
      key: 'categoryName',
      title: '流程分类',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'version',
      title: '版本号',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <NTag type="info">v{row.version}.0</NTag>;
      }
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
      width: 150,
      fixed: 'right',
      render: row => {
        const buttons = [];
        buttons.push(
          <ButtonIcon
            text
            type="primary"
            icon="material-symbols:drive-file-rename-outline-outline"
            tooltipContent={$t('common.edit')}
            onClick={() => edit(row.id)}
          />
        );
        buttons.push(
          <ButtonIcon
            text
            type="error"
            icon="material-symbols:delete-outline"
            tooltipContent={$t('common.delete')}
            popconfirmContent={$t('common.confirmDelete')}
            onPositiveClick={() => handleDelete(row.id)}
          />
        );
        buttons.push(
          <ButtonIcon
            text
            type="primary"
            icon="material-symbols:content-copy"
            tooltipContent="复制流程"
            popconfirmContent={`确定要复制 ${row.flowName} 吗？`}
            onPositiveClick={() => handleCopy(row.id)}
          />
        );

        const firstRowButtons = buttons.flatMap((btn, index) => {
          if (index === 0) return [btn];
          return [<NDivider vertical />, btn];
        });

        const secondRowButtons = [];

        secondRowButtons.push(
          <ButtonIcon
            text
            type="primary"
            icon="material-symbols:file-export"
            tooltipContent="导出流程"
            onClick={() => handleExport(row)}
          />
        );

        secondRowButtons.push(
          isPublish.value ? (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:visibility-outline"
              tooltipContent="查看流程"
              onClick={() => handlePreview(row.id)}
            />
          ) : (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:design-services"
              tooltipContent="流程设计"
              onClick={() => handleDesign(row.id)}
            />
          )
        );

        if (!isPublish.value) {
          secondRowButtons.push(
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:publish"
              tooltipContent="发布流程"
              popconfirmContent={`确定要发布 ${row.flowName} 吗？`}
              onPositiveClick={() => handlePublish(row.id)}
            />
          );
        }

        const secondRowWithDividers = secondRowButtons.flatMap((btn, index) => {
          if (index === 0) return [btn];
          return [<NDivider vertical />, btn];
        });

        return (
          <div class="flex-col">
            <div class="h-[24px] flex-center gap-4px">{firstRowButtons}</div>
            <div class="h-[24px] flex-center gap-4px">{secondRowWithDividers}</div>
          </div>
        );
      }
    }
  ]
});

// 监听运行状态变化
watch(isPublish, async () => {
  const newApiFn = isPublish.value ? fetchGetDefinitionList : fetchGetUnPublishDefinitionList;
  updateApiFn(newApiFn);
  await getDataByPage();
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

function handleDeploy() {
  showImportModal();
}

async function handlePublish(id: CommonType.IdType) {
  const { error } = await fetchPublishDefinition(id);
  if (error) return;
  window.$message?.success('发布成功');
  getDataByPage();
}

async function handleCopy(id: CommonType.IdType) {
  const { error } = await fetchCopyDefinition(id);
  if (error) return;
  window.$message?.success('复制成功');
  // 如果当前是已发布状态，则切换到未发布状态
  if (isPublish.value) {
    isPublish.value = false;
  } else {
    getDataByPage();
  }
}

function handleDesign(id: CommonType.IdType) {
  routerPushByKey('workflow_design', {
    query: {
      definitionId: id.toString(),
      disabled: 'false'
    }
  });
}

function handlePreview(id: CommonType.IdType) {
  routerPushByKey('workflow_design', {
    query: {
      definitionId: id.toString(),
      disabled: 'true'
    }
  });
}

function handleExport(row: TableDataWithIndex<Api.Workflow.Definition>) {
  download(`/workflow/definition/exportDef/${row.id}`, {}, `${row.flowCode}.json`);
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

const expandedKeys = ref<CommonType.IdType[]>(['100']);

const selectable = computed(() => {
  return !loading.value;
});
</script>

<template>
  <TableSiderLayout sider-title="流程分类">
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
            <NEmpty description="暂无流程分类" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <DefinitionSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
      <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
        <template #header>
          <NSpace>
            <NRadioGroup v-model:value="isPublish" on-up size="small">
              <NRadioButton
                v-for="(status, index) in isPublishOptions"
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
            :show-delete="hasAuth('workflow:definition:remove')"
            @add="handleAdd"
            @delete="handleBatchDelete"
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
