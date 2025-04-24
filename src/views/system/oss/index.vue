<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NImage, NPopconfirm } from 'naive-ui';
import { fetchBatchDeleteOss, fetchGetOssList } from '@/service/api/system/oss';
import { fetchGetConfigByKey } from '@/service/api/system/config';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDownload } from '@/hooks/business/download';
import { isImage } from '@/utils/common';
import { $t } from '@/locales';
import OssSearch from './modules/oss-search.vue';
import type { TableDataWithIndex } from '~/packages/hooks/src';

defineOptions({
  name: 'OssList'
});

const appStore = useAppStore();
const { hasAuth } = useAuth();
const { oss } = useDownload();
const preview = ref(false);

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
  apiFn: fetchGetOssList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    fileName: null,
    originalName: null,
    fileSuffix: null,
    service: null
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
      width: 64
    },
    {
      key: 'fileName',
      title: '文件名',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120
    },
    {
      key: 'originalName',
      title: '原名',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120
    },
    {
      key: 'fileSuffix',
      title: '后缀名',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'url',
      title: '文件预览',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120,
      render: row => {
        if (preview.value && isImage(row.fileSuffix)) {
          return <NImage class="h-40px w-40px object-contain" src={row.url} />;
        }
        return <span>{row.url}</span>;
      }
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'createByName',
      title: '上传人',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'service',
      title: '服务商',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const downloadBtn = () => {
          return (
            <NButton type="primary" ghost size="small" onClick={() => handleDownload(row)}>
              下载
            </NButton>
          );
        };

        const deleteBtn = () => {
          if (!hasAuth('system:oss:remove')) {
            return null;
          }
          return (
            <NPopconfirm onPositiveClick={() => handleDelete(row.ossId!)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    {$t('common.delete')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          );
        };

        return (
          <div class="flex-center gap-8px">
            {downloadBtn()}
            {deleteBtn()}
          </div>
        );
      }
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteOss(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(ossId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteOss([ossId]);
  if (error) return;
  onDeleted();
}

async function getConfigKey() {
  const { data: previewStr, error } = await fetchGetConfigByKey('sys.oss.previewListResource');
  if (error) return;
  preview.value = previewStr === 'true';
}
getConfigKey();

function handleDownload(row: TableDataWithIndex<Api.System.Oss>) {
  oss(row.ossId);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OssSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="文件管理列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="false"
          :show-delete="hasAuth('system:oss:remove')"
          :show-export="false"
          @delete="handleBatchDelete"
          @refresh="getData"
        >
          <template #prefix>
            <NSwitch v-model:value="preview">
              <template #checked>开启预览</template>
              <template #unchecked>关闭预览</template>
            </NSwitch>
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
        :row-key="row => row.ossId"
        :pagination="mobilePagination"
        :row-props="() => ({ class: 'w-70px h-70px' })"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
