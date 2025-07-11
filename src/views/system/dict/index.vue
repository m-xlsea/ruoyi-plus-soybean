<script setup lang="tsx">
import { computed, ref } from 'vue';
import type { TreeOption } from 'naive-ui';
import { NDivider, NTooltip } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import {
  fetchBatchDeleteDictData,
  fetchBatchDeleteDictType,
  fetchGetDictDataList,
  fetchGetDictTypeOption,
  fetchRefreshCache
} from '@/service/api/system';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import ButtonIcon from '@/components/custom/button-icon.vue';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import DictDataSearch from './modules/dict-data-search.vue';
import DictDataOperateDrawer from './modules/dict-data-operate-drawer.vue';
import DictTypeOperateDrawer from './modules/dict-type-operate-drawer.vue';

defineOptions({
  name: 'DictList'
});

useDict('sys_user_sex');

const { hasAuth } = useAuth();
const appStore = useAppStore();
const { download } = useDownload();

const dictTypeData = ref<Api.System.DictType>();
const dictOperateType = ref<NaiveUI.TableOperateType>('add');
const { bool: dictTypeDrawerVisible, setTrue: openDictTypeDrawer } = useBoolean();
const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, searchParams } = useTable({
  apiFn: fetchGetDictDataList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    dictLabel: null,
    dictType: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'dictLabel',
      title: $t('page.system.dict.data.label'),
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return <DictTag size="small" dictData={row} />;
      }
    },
    {
      key: 'dictValue',
      title: $t('page.system.dict.data.value'),
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'dictSort',
      title: $t('page.system.dict.data.dictSort'),
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'remark',
      title: $t('page.system.dict.data.remark'),
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'createTime',
      title: $t('page.system.dict.data.createTime'),
      align: 'center',
      minWidth: 80,
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 160,
      render: row => {
        const divider = () => {
          if (!hasAuth('system:dict:edit') || !hasAuth('system:dict:remove')) {
            return null;
          }
          return <NDivider vertical />;
        };

        const editBtn = () => {
          if (!hasAuth('system:dict:edit')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="primary"
              icon="material-symbols:drive-file-rename-outline-outline"
              tooltipContent={$t('common.edit')}
              onClick={() => edit(row.dictCode!)}
            />
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:dict:remove')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              tooltipContent={$t('common.delete')}
              popconfirmContent={$t('common.confirmDelete')}
              onPositiveClick={() => handleDelete(row.dictCode!)}
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
  const { error } = await fetchBatchDeleteDictData(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(dictCode: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteDictData([dictCode]);
  if (error) return;
  onDeleted();
}

async function edit(dictCode: CommonType.IdType) {
  handleEdit('dictCode', dictCode);
}

async function handleExport() {
  download('/system/dict/data/export', searchParams, `字典数据_${new Date().getTime()}.xlsx`);
}

async function handleReset() {
  searchParams.dictLabel = null;
  await getDataByPage();
}

async function handleRefreshCache() {
  const { error } = await fetchRefreshCache();
  if (error) return;
  window.$message?.success($t('page.system.dict.refreshCacheSuccess'));
  await getData();
}

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const dictPattern = ref<string>();
const dictData = ref<Api.System.DictType[]>([]);

function dictFilter(pattern: string, node: TreeOption) {
  const dictName = node.dictName as string;
  const dictType = node.dictType as string;
  return dictName.includes(pattern) || dictType.includes(pattern);
}

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetDictTypeOption();
  if (!error) {
    dictData.value = tree;
  }
  endTreeLoading();
}

getTreeData();

function handleClickTree(keys: string[]) {
  searchParams.dictType = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  dictPattern.value = undefined;
  getTreeData();
}

function renderLabel({ option }: { option: TreeOption }) {
  return (
    <NTooltip placement="left">
      {{
        trigger: () => (
          <div class="w-200px flex gap-6px overflow-hidden text-ellipsis whitespace-nowrap">
            <span>{option.dictName}</span>
            <span class="text-12px text-gray-500">( {option.dictType} )</span>
          </div>
        ),
        default: () => (
          <div class="flex-col">
            <span>
              {option.dictName} {option.dictType}
            </span>
            {option.remark ? <span>( {option.remark} )</span> : null}
            <span>{option.createTime}</span>
          </div>
        )
      }}
    </NTooltip>
  );
}

function renderSuffix({ option }: { option: TreeOption }) {
  return (
    <div class="flex-center gap-12px">
      <ButtonIcon
        text
        type="primary"
        icon="material-symbols:drive-file-rename-outline-outline"
        tooltip-content={$t('common.edit')}
        onClick={(event: Event) => {
          event.stopPropagation();
          handleEditType(option as Api.System.DictType);
        }}
      />
      <ButtonIcon
        text
        type="error"
        icon="material-symbols:delete-outline"
        tooltip-content={$t('common.delete')}
        popconfirm-content={`${$t('page.system.dict.confirmDeleteDictType')} ${option.dictType} ？`}
        onClick={(event: Event) => event.stopPropagation()}
        onPositiveClick={() => handleDeleteType(option as Api.System.DictType)}
      />
    </div>
  );
}

function handleAddType() {
  dictTypeData.value = undefined;
  dictOperateType.value = 'add';
  openDictTypeDrawer();
}

function handleEditType(dictType: Api.System.DictType) {
  dictTypeData.value = dictType;
  dictOperateType.value = 'edit';
  openDictTypeDrawer();
}

async function handleDeleteType(dictType: Api.System.DictType) {
  const { error } = await fetchBatchDeleteDictType([dictType.dictId]);
  if (error) return;
  window.$message?.success($t('common.deleteSuccess'));
  getTreeData();
}

async function handleExportType() {
  download('/system/dict/type/export', searchParams, `${$t('page.system.dict.dictType')}_${new Date().getTime()}.xlsx`);
}

const selectable = computed(() => {
  return !loading.value;
});
</script>

<template>
  <TableSiderLayout :sider-title="$t('page.system.dict.dictTypeTitle')">
    <template #header-extra>
      <ButtonIcon
        v-if="hasAuth('system:dict:add')"
        size="small"
        icon="material-symbols:add-rounded"
        class="h-18px text-icon"
        :tooltip-content="$t('page.system.dict.addDictType')"
        @click.stop="() => handleAddType()"
      />
      <ButtonIcon
        v-if="hasAuth('system:dict:export')"
        size="small"
        icon="material-symbols:download-rounded"
        class="h-18px text-icon"
        :tooltip-content="$t('page.system.dict.exportDictType')"
        @click.stop="() => handleExportType()"
      />
      <ButtonIcon
        size="small"
        icon="material-symbols:refresh-rounded"
        class="h-18px text-icon"
        :tooltip-content="$t('page.system.dict.refreshDictType')"
        @click.stop="() => handleResetTreeData()"
      />
    </template>
    <template #sider>
      <NInput v-model:value="dictPattern" clearable :placeholder="$t('common.keywordSearch')" />
      <NSpin class="dict-tree" :show="treeLoading">
        <NTree
          block-node
          show-line
          :data="dictData as []"
          :show-irrelevant-nodes="false"
          :pattern="dictPattern"
          :filter="dictFilter"
          class="infinite-scroll h-full min-h-200px py-3"
          key-field="dictType"
          label-field="dictName"
          virtual-scroll
          :selectable="selectable"
          :render-label="renderLabel"
          :render-suffix="renderSuffix"
          @update:selected-keys="handleClickTree"
        >
          <template #empty>
            <NEmpty :description="$t('page.system.dict.dictTypeIsEmpty')" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:overflow-auto">
      <DictDataSearch v-model:model="searchParams" @reset="handleReset" @search="getDataByPage" />
      <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
      <NCard :title="$t('page.system.dict.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
        <template #header-extra>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :disable-add="!searchParams.dictType"
            :loading="loading"
            :show-add="hasAuth('system:user:add')"
            :show-delete="hasAuth('system:user:remove')"
            :show-export="hasAuth('system:user:export')"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
            @export="handleExport"
          >
            <template #prefix>
              <NButton ghost size="small" @click="handleRefreshCache">
                <template #icon>
                  <icon-material-symbols:refresh-rounded class="text-icon" />
                </template>
                {{ $t('page.system.dict.refreshCache') }}
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
          :row-key="row => row.dictCode"
          :pagination="mobilePagination"
          class="h-full"
        />
        <DictDataOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          :dict-type="searchParams.dictType || ''"
          @submitted="getData"
        />
        <DictTypeOperateDrawer
          v-model:visible="dictTypeDrawerVisible"
          :operate-type="dictOperateType"
          :row-data="dictTypeData"
          @submitted="getTreeData"
        />
      </NCard>
    </div>
  </TableSiderLayout>
</template>

<style scoped lang="scss">
.dict-tree {
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
    height: 30px;
  }

  :deep(.n-tree-node-switcher) {
    height: 30px;
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
