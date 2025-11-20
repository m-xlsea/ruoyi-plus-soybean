<script setup lang="tsx">
import { ref } from 'vue';
import { NDivider } from 'naive-ui';
import { fetchBatchDeleteNotice, fetchGetNoticeList } from '@/service/api/system/notice';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import NoticeOperateDrawer from './modules/notice-operate-drawer.vue';
import NoticeSearch from './modules/notice-search.vue';

defineOptions({
  name: 'NoticeList'
});

useDict('sys_notice_type');
useDict('sys_normal_disable');
const appStore = useAppStore();
const { hasAuth } = useAuth();

const searchParams = ref<Api.System.NoticeSearchParams>({
  pageNum: 1,
  pageSize: 10,
  noticeTitle: null,
  noticeType: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    api: () => fetchGetNoticeList(searchParams.value),
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
        key: 'noticeTitle',
        title: '公告标题',
        align: 'center',
        width: 300
      },
      {
        key: 'noticeType',
        title: '公告类型',
        align: 'center',
        minWidth: 120,
        render(row) {
          return <DictTag size="small" value={row.noticeType} dictCode="sys_notice_type" />;
        }
      },
      {
        key: 'status',
        title: '公告状态',
        align: 'center',
        minWidth: 120,
        render(row) {
          return <DictTag size="small" value={row.status} dictCode="sys_normal_disable" />;
        }
      },
      {
        key: 'createByName',
        title: '创建者',
        align: 'center',
        minWidth: 120
      },
      {
        key: 'createTime',
        title: '创建时间',
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
            if (!hasAuth('system:notice:edit') || !hasAuth('system:notice:remove')) {
              return null;
            }
            return <NDivider vertical />;
          };

          const editBtn = () => {
            if (!hasAuth('system:notice:edit')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="primary"
                icon="material-symbols:drive-file-rename-outline-outline"
                tooltipContent={$t('common.edit')}
                onClick={() => edit(row.noticeId!)}
              />
            );
          };

          const deleteBtn = () => {
            if (!hasAuth('system:notice:remove')) {
              return null;
            }
            return (
              <ButtonIcon
                text
                type="error"
                icon="material-symbols:delete-outline"
                tooltipContent={$t('common.delete')}
                popconfirmContent={$t('common.confirmDelete')}
                onPositiveClick={() => handleDelete(row.noticeId!)}
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
  useTableOperate(data, 'noticeId', getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteNotice(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function handleDelete(noticeId: CommonType.IdType) {
  // request
  const { error } = await fetchBatchDeleteNotice([noticeId]);
  if (error) return;
  onDeleted();
}

async function edit(noticeId: CommonType.IdType) {
  handleEdit(noticeId);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NoticeSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="通知公告列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="hasAuth('system:notice:add')"
          :show-delete="hasAuth('system:notice:remove')"
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
        :row-key="row => row.noticeId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <NoticeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
