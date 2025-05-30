<script setup lang="tsx">
import { ref, watch } from 'vue';
import { fetchGetGenDataNames, fetchGetGenDbList, fetchImportGenTable } from '@/service/api/tool';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import GenTableDbSearch from './gen-table-db-search.vue';

defineOptions({
  name: 'GenTableImportDrawer'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const appStore = useAppStore();

const { columns, data, getData, getDataByPage, loading, mobilePagination, searchParams } = useTable({
  apiFn: fetchGetGenDbList,
  immediate: false,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 15,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    dataName: null,
    tableName: null,
    tableComment: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 52
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'tableName',
      title: '表名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'tableComment',
      title: '表描述',
      align: 'center',
      minWidth: 120
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  if (checkedRowKeys.value.length > 0) {
    // request
    const { error } = await fetchImportGenTable(checkedRowKeys.value as string[], searchParams.dataName!);
    if (error) return;
    window.$message?.success('导入成功');
    emit('submitted');
  }
  closeDrawer();
}

const dataNameOptions = ref<CommonType.Option[]>([]);

async function handleResetSearchParams() {
  searchParams.dataName = dataNameOptions.value.length ? dataNameOptions.value[0].value : null;
  searchParams.tableName = null;
  searchParams.tableComment = null;
  data.value = [];
  checkedRowKeys.value = [];
  await getDataByPage();
}

async function getDataNames() {
  const { error, data: dataNames } = await fetchGetGenDataNames();
  if (error) return;
  dataNameOptions.value = dataNames.map(item => ({ label: item, value: item }));
}

watch(visible, async () => {
  if (visible.value) {
    await getDataNames();
    await handleResetSearchParams();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent title="导入表" :native-scrollbar="false" closable>
      <div class="h-full flex-col">
        <GenTableDbSearch
          v-model:model="searchParams"
          :options="dataNameOptions"
          @reset="handleResetSearchParams"
          @search="getDataByPage"
        />
        <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" class="mb-16px" />
        <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :scroll-x="750"
          :loading="loading"
          remote
          :row-key="row => row.tableName"
          :pagination="mobilePagination"
          class="flex-1"
        />
      </div>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
:deep(.n-drawer-body-content-wrapper) {
  height: 100%;
}
</style>
