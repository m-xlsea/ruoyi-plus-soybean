<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteConfig, fetchGetConfigList, fetchRefreshCache } from '@/service/api/system/config';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import ConfigOperateDrawer from './modules/config-operate-drawer.vue';
import ConfigSearch from './modules/config-search.vue';

defineOptions({
  name: 'ConfigList'
});

useDict('sys_yes_no');

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

const searchParams = ref<Api.System.ConfigSearchParams>({
  pageNum: 1,
  pageSize: 10,
  configName: null,
  configKey: null,
  configType: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetConfigList(searchParams.value),
    transform: response => defaultTransform(response),
    onPaginationParamsChange: params => {
      searchParams.value.pageNum = params.page;
      searchParams.value.pageSize = params.pageSize;
    },
    columns: () => [
      {
        type: 'selection',
        align: 'center',
        width: 48
      },
      {
        key: 'index',
        title: $t('common.index'),
        align: 'center',
        width: 64,
        render: (_, index) => index + 1
      },
      {
        key: 'configName',
        title: $t('page.system.config.configName'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'configKey',
        title: $t('page.system.config.configKey'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'configValue',
        title: $t('page.system.config.configValue'),
        align: 'center',
        minWidth: 120
      },
      {
        key: 'configType',
        title: $t('page.system.config.configType'),
        align: 'center',
        minWidth: 120,
        render(row) {
          return <DictTag size="small" value={row.configType} dictCode="sys_yes_no" />;
        }
      },
      {
        key: 'remark',
        title: $t('page.system.config.remark'),
        align: 'center',
        minWidth: 120,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'createTime',
        title: $t('page.system.config.createTime'),
        align: 'center',
        minWidth: 120,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => {
          const divider = () => {
            if (!hasAuth('system:config:edit') || !hasAuth('system:config:remove')) {
              return null;
            }
            return <NDivider vertical />;
          };

          const editBtn = () => {
            if (!hasAuth('system:config:edit')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.configId!)}
              />
            );
          };

          const deleteBtn = () => {
            if (!hasAuth('system:config:remove')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.configId!)}
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
  useTableOperate(data, 'configId', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteConfig(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(configId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteConfig([configId]);
  if (error) return;
  onDeleted();
}

async function edit(configId: CommonType.IdType) {
  handleEdit(configId);
}

async function handleExport() {
  download('/system/config/export', searchParams.value, `参数配置_${new Date().getTime()}.xlsx`);
}

async function handleRefreshCache() {
  const { error } = await fetchRefreshCache();
  if (error) return;
  window.$message?.success($t('page.system.config.refreshCacheSuccess'));
  await getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ConfigSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.system.config.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:config:add')"
          :show-delete="hasAuth('system:config:remove')"
          :show-export="hasAuth('system:config:export')"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        >
          <template #prefix>
            <NButton v-if="hasAuth('system:config:remove')" ghost size="small" @click="handleRefreshCache">
              <template #icon>
                <icon-material-symbols-sync-outline />
              </template>
              {{ $t('page.system.config.refreshCache') }}
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
        :row-key="row => row.configId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <ConfigOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
