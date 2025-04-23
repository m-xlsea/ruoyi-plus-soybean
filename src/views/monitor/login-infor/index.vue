<script setup lang="tsx">
import { NButton } from 'naive-ui';
import { fetchBatchDeleteLoginInfor, fetchGetLoginInforList } from '@/service/api/monitor/login-infor';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { useDownload } from '@/hooks/business/download';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { getBrowserIcon, getOsIcon } from '@/utils/format';
import DictTag from '@/components/custom/dict-tag.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';
import LoginInforSearch from './modules/login-infor-search.vue';
import LoginInforViewDrawer from './modules/login-infor-view-drawer.vue';

defineOptions({
  name: 'LoginInforList'
});

const appStore = useAppStore();
const { download } = useDownload();
const { hasAuth } = useAuth();

useDict('sys_common_status');
useDict('sys_device_type');

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
  apiFn: fetchGetLoginInforList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    userName: null,
    ipaddr: null,
    status: null
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
      key: 'userName',
      title: '用户账号',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'deviceType',
      title: '设备类型',
      align: 'center',
      minWidth: 120,
      render: row => {
        return <DictTag size="small" value={row.deviceType} dict-code="sys_device_type" />;
      }
    },
    {
      key: 'ipaddr',
      title: '登录IP地址',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'loginLocation',
      title: '登录地点',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'browser',
      title: '浏览器类型',
      align: 'center',
      minWidth: 120,
      render: row => {
        return (
          <div class="flex items-center gap-2">
            <SvgIcon icon={getBrowserIcon(row.browser)} />
            {row.browser}
          </div>
        );
      }
    },
    {
      key: 'os',
      title: '操作系统',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120,
      render: row => {
        const osName = row.os?.split(' or ')[0] ?? '';
        return (
          <div class="flex items-center gap-2">
            <SvgIcon icon={getOsIcon(osName)} />
            {osName}
          </div>
        );
      }
    },
    {
      key: 'status',
      title: '登录状态',
      align: 'center',
      minWidth: 120,
      render: row => {
        return <DictTag size="small" value={row.status} dict-code="sys_common_status" />;
      }
    },
    {
      key: 'loginTime',
      title: '访问时间',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const viewBtn = () => {
          return (
            <NButton type="primary" ghost size="small" onClick={() => view(row.infoId!)}>
              详情
            </NButton>
          );
        };
        return <div class="flex-center gap-8px">{viewBtn()}</div>;
      }
    }
  ]
});

const { drawerVisible, editingData, handleEdit, checkedRowKeys, onBatchDeleted } = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchBatchDeleteLoginInfor(checkedRowKeys.value);
  if (error) return;
  onBatchDeleted();
}

async function view(infoId: CommonType.IdType) {
  handleEdit('infoId', infoId);
}

async function handleExport() {
  download('/monitor/logininfor/export', searchParams, `登录日志记录_${new Date().getTime()}.xlsx`);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LoginInforSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="登录日志列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :show-add="false"
          :show-delete="hasAuth('monitor:logininfor:remove')"
          :show-export="hasAuth('monitor:logininfor:export')"
          @delete="handleBatchDelete"
          @export="handleExport"
          @refresh="getData"
        />
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
        :row-key="row => row.infoId"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <LoginInforViewDrawer v-model:visible="drawerVisible" :row-data="editingData" />
    </NCard>
  </div>
</template>

<style scoped></style>
