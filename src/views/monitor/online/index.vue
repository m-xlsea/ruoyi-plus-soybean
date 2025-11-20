<script setup lang="tsx">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { fetchForceLogout, fetchGetOnlineUserList } from '@/service/api/monitor/online';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import { defaultTransform, useNaivePaginatedTable } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { getBrowserIcon, getOsIcon } from '@/utils/icon-tag-format';
import ButtonIcon from '@/components/custom/button-icon.vue';
import DictTag from '@/components/custom/dict-tag.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';
import OnlineSearch from './modules/online-search.vue';

defineOptions({
  name: 'OnlineList'
});

const appStore = useAppStore();
const { hasAuth } = useAuth();

useDict('sys_common_status');
useDict('sys_device_type');

const searchParams = ref<Api.Monitor.OnlineUserSearchParams>({
  userName: null,
  ipaddr: null,
  params: {}
});

const { columns, columnChecks, data, getData, loading, scrollX } = useNaivePaginatedTable({
  api: () => fetchGetOnlineUserList(searchParams.value),
  transform: response => defaultTransform(response),
  columns: () => [
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
          <div class="flex items-center justify-center gap-2">
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
          <div class="flex items-center justify-center gap-2">
            <SvgIcon icon={getOsIcon(osName)} />
            {osName}
          </div>
        );
      }
    },
    {
      key: 'loginTime',
      title: '登录时间',
      align: 'center',
      ellipsis: {
        tooltip: true
      },
      minWidth: 120,
      render: row => {
        return dayjs(row.loginTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const forceLogoutBtn = () => {
          if (!hasAuth('monitor:online:forceLogout')) {
            return null;
          }
          return (
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              class="text-20px"
              tooltipContent="强制下线"
              popconfirmContent="确认强制下线吗？"
              onPositiveClick={() => handleForceLogout(row.tokenId)}
            />
          );
        };
        return <div>{forceLogoutBtn()}</div>;
      }
    }
  ]
});

async function handleForceLogout(tokenId: string) {
  // request
  const { error } = await fetchForceLogout(tokenId);
  if (error) return;
  getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OnlineSearch v-model:model="searchParams" @search="getData" />
    <NCard title="在线用户列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          :show-add="false"
          :show-delete="false"
          :show-export="false"
          @refresh="getData"
        />
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="scrollX"
        :loading="loading"
        remote
        :row-key="row => row.tokenId"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
