<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import type { SelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetRoleSelect } from '@/service/api/system';

defineOptions({
  name: 'RoleSelect'
});

interface Props {
  [key: string]: any;
}

defineProps<Props>();

const value = defineModel<CommonType.IdType[] | null>('value', { required: false });

const attrs: SelectProps = useAttrs();

const { loading: roleLoading, startLoading: startRoleLoading, endLoading: endRoleLoading } = useLoading();

/** the enabled role options */
const roleOptions = ref<CommonType.Option<CommonType.IdType>[]>([]);

async function getRoleOptions() {
  startRoleLoading();
  const { error, data } = await fetchGetRoleSelect();

  if (!error) {
    roleOptions.value = data.map(item => ({
      label: item.roleName,
      value: item.roleId
    }));
  }
  endRoleLoading();
}

getRoleOptions();
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="roleLoading"
    :options="roleOptions"
    v-bind="attrs"
    placeholder="请选择角色"
  />
</template>

<style scoped></style>
