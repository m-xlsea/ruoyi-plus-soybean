<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchTenantList } from '@/service/api';
import { fetchChangeTenant, fetchClearTenant } from '@/service/api/system/tenant';
import { useTabStore } from '@/store/modules/tab';
import { useAuth } from '@/hooks/business/auth';

const { hasRole } = useAuth();
const { clearTabs } = useTabStore();
const router = useRouter();
defineOptions({ name: 'TenantSelect' });

interface Props {
  clearable?: boolean;
}

withDefaults(defineProps<Props>(), {
  clearable: false
});

const tenantId = defineModel<CommonType.IdType>('tenantId', { required: false, default: undefined });
const enabled = defineModel<boolean>('enabled', { required: false, default: true });

const lastSelected = ref<CommonType.IdType>();

const tenantOption = ref<SelectOption[]>([]);
const { loading, startLoading, endLoading } = useLoading();

const showTenantSelect = computed<boolean>(() => {
  return hasRole('superadmin') && enabled.value;
});

async function handleChangeTenant(_tenantId: CommonType.IdType) {
  if (!_tenantId) {
    return;
  }
  if (lastSelected.value === _tenantId) {
    return;
  }
  await fetchChangeTenant(_tenantId);
  lastSelected.value = _tenantId;
  window.$message?.success('切换租户成功');
  clearTabs();
  router.push('/');
}

async function handleClearTenant() {
  await fetchClearTenant();
  lastSelected.value = '';
  window.$message?.success('切换为默认租户');
  clearTabs();
  router.push('/');
}

async function handleFetchTenantList() {
  startLoading();
  const { data, error } = await fetchTenantList();
  if (error) return;
  enabled.value = data.tenantEnabled;
  tenantOption.value = data.voList.map(tenant => {
    return {
      label: tenant.companyName,
      value: tenant.tenantId
    };
  });
  endLoading();
}
onMounted(async () => {
  if (!hasRole('superadmin')) {
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
