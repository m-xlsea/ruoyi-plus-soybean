<script setup lang="ts">
import { ref, useAttrs, watch } from 'vue';
import type { SelectProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetPostSelect } from '@/service/api/system';

defineOptions({
  name: 'PostSelect'
});

interface Props {
  deptId?: CommonType.IdType | null;
  [key: string]: any;
}

const props = defineProps<Props>();

const value = defineModel<CommonType.IdType[] | null>('value', { required: false });

const attrs: SelectProps = useAttrs();

const { loading: postLoading, startLoading: startPostLoading, endLoading: endPostLoading } = useLoading();

/** the enabled role options */
const roleOptions = ref<CommonType.Option<CommonType.IdType>[]>([]);

watch(
  () => props.deptId,
  () => {
    if (!props.deptId) {
      roleOptions.value = [];
      return;
    }
    getRoleOptions();
  },
  { immediate: true }
);

async function getRoleOptions() {
  startPostLoading();
  const { error, data } = await fetchGetPostSelect(props.deptId!);

  if (!error) {
    roleOptions.value = data.map(item => ({
      label: item.postName,
      value: item.postId
    }));
  }
  endPostLoading();
}
</script>

<template>
  <NSelect
    v-model:value="value"
    :loading="postLoading"
    :options="roleOptions"
    v-bind="attrs"
    placeholder="请选择岗位"
  />
</template>

<style scoped></style>
