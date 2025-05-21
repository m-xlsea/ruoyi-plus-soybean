<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchTenantList } from '@/service/api';
import { fetchChangeTenant, fetchClearTenant } from '@/service/api/system/tenant';
import { useAppStore } from '@/store/modules/app';
import { useTabStore } from '@/store/modules/tab';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({ name: 'TenantSelect' });

interface Props {
  clearable?: boolean;
}

withDefaults(defineProps<Props>(), {
  clearable: false
});

const appStore = useAppStore();
const { userInfo } = useAuthStore();
const { clearTabs } = useTabStore();
const { toHome } = useRouterPush();

const tenantId = defineModel<CommonType.IdType>('tenantId', { required: false, default: undefined });
const enabled = defineModel<boolean>('enabled', { required: false, default: false });

const lastSelected = ref<CommonType.IdType>();

const tenantOption = ref<SelectOption[]>([]);
const { loading, startLoading, endLoading } = useLoading();

const showTenantSelect = computed<boolean>(() => {
  return userInfo.user?.userId === 1 && enabled.value;
});

/**
 * 关闭当前页面并刷新
 *
 * @param msg 提示信息
 * @param val 租户ID
 */
async function closeAndRefresh(msg: string, val: CommonType.IdType = '') {
  lastSelected.value = val;
  window.$message?.success(msg);
  clearTabs([], true);
  toHome();
  appStore.reloadPage(500);
}

async function handleChangeTenant(_tenantId: CommonType.IdType) {
  if (!_tenantId) {
    return;
  }
  if (lastSelected.value === _tenantId) {
    return;
  }
  await fetchChangeTenant(_tenantId);
  closeAndRefresh('切换租户成功', _tenantId);
}

async function handleClearTenant() {
  await fetchClearTenant();
  closeAndRefresh('切换为默认租户');
}

async function handleFetchTenantList() {
  startLoading();
  const { data, error } = await fetchTenantList();
  if (error) return;
  enabled.value = data.tenantEnabled;
  if (data.tenantEnabled) {
    tenantOption.value = data.voList.map(tenant => {
      return {
        label: tenant.companyName,
        value: tenant.tenantId
      };
    });
  }
  endLoading();
}
onMounted(async () => {
  if (userInfo.user?.userId !== 1) {
    return;
  }
  await handleFetchTenantList();
});
</script>

<template>
  <NSelect
    v-if="showTenantSelect"
    v-model:value="tenantId"
    :clearable="clearable"
    placeholder="请选择租户"
    :options="tenantOption"
    :loading="loading"
    @update:value="handleChangeTenant"
    @clear="handleClearTenant"
  />
</template>
