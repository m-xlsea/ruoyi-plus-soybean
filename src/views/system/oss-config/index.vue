<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider, NTag } from 'naive-ui';
import {
  fetchBatchDeleteOssConfig,
  fetchGetOssConfigList,
  fetchUpdateOssConfigStatus
} from '@/service/api/system/oss-config';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import StatusSwitch from '@/components/custom/status-switch.vue';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';
import OssConfigOperateDrawer from './modules/oss-config-operate-drawer.vue';
import OssConfigSearch from './modules/oss-config-search.vue';

defineOptions({
  name: 'OssConfigList'
});

useDict('sys_yes_no');

const appStore = useAppStore();
const { hasAuth } = useAuth();

const searchParams = ref<Api.System.OssConfigSearchParams>({
  pageNum: 1,
  pageSize: 10,
  configKey: null,
  bucketName: null,
  region: null,
  status: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetOssConfigList(searchParams.value),
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
        key: 'configKey',
        title: '配置名称',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'bucketName',
        title: '桶名称',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'endpoint',
        title: '访问站点',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'region',
        title: '域',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'accessPolicy',
        title: '桶权限类型',
        align: 'center',
        minWidth: 120,
        render(row) {
          if (row.accessPolicy === '0') {
            return <NTag type="info">私有</NTag>;
          }
          if (row.accessPolicy === '1') {
            return <NTag type="success">公有</NTag>;
          }
          if (row.accessPolicy === '2') {
            return <NTag type="warning">自定义</NTag>;
          }
          return null;
        }
      },
      {
        key: 'status',
        title: '是否默认',
        align: 'center',
        minWidth: 120,
        render(row) {
          return (
            <StatusSwitch
              v-model:value={row.status}
              info={row.configKey}
              onSubmitted={(value, callback) => handleStatusChange(row, value, callback)}
            />
          );
        }
      },
      {
        key: 'remark',
        title: '备注',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => {
          const divider = () => {
            if (!hasAuth('system:ossConfig:edit') || !hasAuth('system:ossConfig:remove')) {
              return null;
            }
            return <NDivider vertical />;
          };

          const editBtn = () => {
            if (!hasAuth('system:ossConfig:edit')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.ossConfigId!)}
              />
            );
          };

          const deleteBtn = () => {
            if (!hasAuth('system:ossConfig:remove')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.ossConfigId!)}
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
  useTableOperate(data, 'ossConfigId', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteOssConfig(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(ossConfigId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteOssConfig([ossConfigId]);
  if (error) return;
  onDeleted();
}

async function edit(ossConfigId: CommonType.IdType) {
  handleEdit(ossConfigId);
}

/** 处理状态切换 */
async function handleStatusChange(
  row: Api.System.OssConfig,
  value: Api.Common.EnableStatus,
  callback: (flag: boolean) => void
) {
  const { error } = await fetchUpdateOssConfigStatus({
    configKey: row.configKey,
    ossConfigId: row.ossConfigId,
    status: value
  });

  callback(!error);

  if (!error) {
    window.$message?.success('状态修改成功');
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OssConfigSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="OSS配置列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:ossConfig:add')"
          :show-delete="hasAuth('system:ossConfig:remove')"
          :show-export="false"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
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
        :row-key="row => row.ossConfigId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OssConfigOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
