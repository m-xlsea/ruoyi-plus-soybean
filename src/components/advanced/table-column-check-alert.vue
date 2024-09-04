<script setup lang="ts">
defineOptions({
  name: 'TableColumnCheckAlert'
});

const checkedRowKeys = defineModel<CommonType.IdType[]>('columns', { required: true });
</script>

<template>
  <NAlert type="info">
    <span v-if="checkedRowKeys.length">
      已选择{{ checkedRowKeys.length }}条记录
      <NButton class="pl-6px" text type="primary" @click="() => (checkedRowKeys = [])">清空</NButton>
    </span>
    <span v-else>未选中任何记录</span>
  </NAlert>
</template>

<style scoped lang="scss">
.n-alert {
  --n-padding: 5px 13px !important;
  --n-icon-margin: 6px 8px 0 12px !important;
  --n-icon-size: 20px !important;
}
</style>
