<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetDeptTree, fetchGetUserList } from '@/service/api/system';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import UserSearch from '@/views/system/user/modules/user-search.vue';
import DictTag from './dict-tag.vue';

defineOptions({
  name: 'UserSelectModal'
});

interface Props {
  title?: string;
  multiple?: boolean;
  /** 禁选用户ID */
  disabledIds?: CommonType.IdType[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户选择',
  multiple: false,
  disabledIds: () => []
});

interface Emits {
  (e: 'confirm', value: CommonType.IdType[]): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

useDict('sys_normal_disable');

const appStore = useAppStore();

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
  apiFn: fetchGetUserList,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    deptId: null,
    userName: null,
    nickName: null,
    phonenumber: null,
    status: null,
    params: {}
  },
  immediate: false,
  columns: () => [
    {
      type: 'selection',
      multiple: props.multiple,
      align: 'center',
      width: 48,
      disabled: row => props.disabledIds.includes(row.userId.toString())
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      title: $t('page.system.user.userName'),
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'nickName',
      title: $t('page.system.user.nickName'),
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'deptName',
      title: $t('page.system.user.deptName'),
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'phonenumber',
      title: $t('page.system.user.phonenumber'),
      align: 'center',
      minWidth: 120,
      ellipsis: true
    },
    {
      key: 'status',
      title: $t('page.system.user.status'),
      align: 'center',
      minWidth: 80,
      render(row) {
        return <DictTag dict-code="sys_normal_disable" value={row.status} />;
      }
    },
    {
      key: 'createTime',
      title: $t('page.system.user.createTime'),
      align: 'center',
      minWidth: 120
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);

const { loading: treeLoading, startLoading: startTreeLoading, endLoading: endTreeLoading } = useLoading();
const deptPattern = ref<string>();
const deptData = ref<Api.Common.CommonTreeRecord>([]);
const selectedKeys = ref<string[]>([]);

async function getTreeData() {
  startTreeLoading();
  const { data: tree, error } = await fetchGetDeptTree();
  if (!error) {
    deptData.value = tree;
  }
  endTreeLoading();
}

function handleClickTree(keys: string[]) {
  searchParams.deptId = keys.length ? keys[0] : null;
  checkedRowKeys.value = [];
  getDataByPage();
}

function handleResetTreeData() {
  deptPattern.value = undefined;
  getTreeData();
}

const expandedKeys = ref<CommonType.IdType[]>([100]);

const selectable = computed(() => {
  return !loading.value;
});

function handleResetSearch() {
  resetSearchParams();
  selectedKeys.value = [];
}

function closeModal() {
  visible.value = false;
}

function handleConfirm() {
  emit('confirm', checkedRowKeys.value);
  closeModal();
}

function getRowProps(row: Api.System.User) {
  return {
    onClick: () => {
      if (props.disabledIds.includes(row.userId.toString())) {
        return;
      }
      if (props.multiple) {
        const index = checkedRowKeys.value.findIndex(key => key === row.userId);
        if (index > -1) {
          checkedRowKeys.value.splice(index, 1);
        } else {
          checkedRowKeys.value.push(row.userId);
        }
      } else {
        checkedRowKeys.value = [row.userId];
      }
    }
  };
}

watch(visible, () => {
  if (visible.value) {
    getTreeData();
    getData();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    class="user-select-modal max-h-800px max-w-90% w-1400px"
    preset="card"
    size="medium"
    :title="props.title"
  >
    <TableSiderLayout :sider-title="$t('page.system.dept.title')">
      <template #header-extra>
        <NButton size="small" text class="h-18px" @click.stop="() => handleResetTreeData()">
          <template #icon>
            <SvgIcon icon="ic:round-refresh" />
          </template>
        </NButton>
      </template>
      <template #sider>
        <NInput v-model:value="deptPattern" clearable :placeholder="$t('common.keywordSearch')" />
        <NSpin class="dept-tree" :show="treeLoading">
          <NTree
            v-model:expanded-keys="expandedKeys"
            v-model:selected-keys="selectedKeys"
            block-node
            show-line
            :data="deptData as []"
            :show-irrelevant-nodes="false"
            :pattern="deptPattern"
            class="infinite-scroll h-full min-h-200px py-3"
            key-field="id"
            label-field="label"
            virtual-scroll
            :selectable="selectable"
            @update:selected-keys="handleClickTree"
          >
            <template #empty>
              <NEmpty :description="$t('page.system.dept.empty')" class="h-full min-h-200px justify-center" />
            </template>
          </NTree>
        </NSpin>
      </template>
      <div class="h-full flex-col-stretch gap-12px overflow-hidden lt-sm:max-h-500px lt-sm:overflow-auto">
        <UserSearch v-model:model="searchParams" @reset="handleResetSearch" @search="getDataByPage" />
        <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
        <NAlert v-if="props.disabledIds.length > 0" type="warning">
          <span>已存在的用户无法被选择</span>
        </NAlert>
        <NCard
          :title="$t('page.system.user.title')"
          :bordered="false"
          size="small"
          class="card-wrapper sm:flex-1-hidden lt-sm:overflow-auto"
        >
          <template #header-extra>
            <TableHeaderOperation
              v-model:columns="columnChecks"
              :loading="loading"
              :show-add="false"
              :show-delete="false"
              :show-export="false"
              @refresh="getData"
            ></TableHeaderOperation>
          </template>
          <NDataTable
            v-model:checked-row-keys="checkedRowKeys"
            :columns="columns"
            :data="data"
            size="small"
            :flex-height="!appStore.isMobile"
            :scroll-x="962"
            :loading="loading"
            :row-props="getRowProps"
            remote
            :row-key="row => row.userId"
            :pagination="mobilePagination"
            class="h-full lt-sm:max-h-300px"
          />
        </NCard>
      </div>
    </TableSiderLayout>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped lang="scss">
:deep(.n-layout) {
  height: 600px;

  @media (max-width: 639px) {
    height: auto;
    max-height: 500px;
  }
}

.user-select-modal {
  @media (max-width: 639px) {
    :deep(.n-card-content) {
      overflow: hidden;
    }

    :deep(.n-data-table) {
      max-height: 300px;
    }
  }
}

.n-alert {
  --n-padding: 5px 13px !important;
  --n-icon-margin: 6px 8px 0 12px !important;
  --n-icon-size: 20px !important;
}
</style>
