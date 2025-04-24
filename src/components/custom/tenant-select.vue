<script setup lang="ts">
import { ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchTenantList } from '@/service/api';

defineOptions({ name: 'TenantSelect' });

const value = defineModel<CommonType.IdType>('value', { required: false, default: '000000' });
const enabled = defineModel<boolean>('enabled', { required: false, default: false });

const tenantOption = ref<SelectOption[]>([]);
const { loading, startLoading, endLoading } = useLoading();

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

handleFetchTenantList();
</script>

<template>
  <NSelect
    v-if="enabled"
    v-model:value="value"
    placeholder="请选择/输入公司名称"
    :options="tenantOption"
    :loading="loading"
  />
</template>
