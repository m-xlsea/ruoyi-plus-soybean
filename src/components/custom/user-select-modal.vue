<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetDeptTree, fetchGetUserList } from '@/service/api/system';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
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
  rowKeys?: CommonType.IdType[];
  searchUserIds?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户选择',
  multiple: false,
  disabledIds: () => [],
  rowKeys: () => [],
  searchUserIds: null
});

interface Emits {
  (e: 'confirm', value: CommonType.IdType[], rows?: Api.System.User[]): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

useDict('sys_normal_disable');

const appStore = useAppStore();

const searchParams = ref<Api.System.UserSearchParams>({
  pageNum: 1,
  pageSize: 10,
  deptId: null,
  userName: null,
  nickName: null,
  phonenumber: null,
  status: null,
  params: {}
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination, scrollX } =
  useNaivePaginatedTable({
    immediate: false,
    api: () => fetchGetUserList(searchParams.value),
    transform: response => defaultTransform(response),
    onPaginationParamsChange: params => {
      searchParams.value.pageNum = params.page;
      searchParams.value.pageSize = params.pageSize;
    },
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

const { checkedRowKeys } = useTableOperate(data, 'userId', getData);

// 存储所有页面的用户数据，用于跨页选择
const allPagesData = ref<Api.System.User[]>([]);

// 更新allPagesData，保存当前页数据
function updateAllPagesData() {
  // 将当前页数据添加到allPagesData中，避免重复
  data.value.forEach(user => {
    const existIndex = allPagesData.value.findIndex(item => item.userId === user.userId);
    if (existIndex === -1) {
      allPagesData.value.push(user);
    } else {
      // 更新已存在的数据
      allPagesData.value[existIndex] = user;
    }
  });
}

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
  searchParams.value.deptId = keys.length ? keys[0] : null;
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
  selectedKeys.value = [];
}

function closeModal() {
  checkedRowKeys.value = [];
  allPagesData.value = [];
  visible.value = false;
}

function handleConfirm() {
  if (checkedRowKeys.value.length === 0) {
    window.$message?.error('请选择用户');
    return;
  }
  // 获取选中行对应的用户对象（从所有页面数据中筛选）
  const selectedUsers = allPagesData.value.filter(item => checkedRowKeys.value.includes(item.userId.toString()));
  emit('confirm', checkedRowKeys.value, selectedUsers);
  closeModal();
}

function getRowProps(row: Api.System.User) {
  return {
    onClick: (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.n-data-table-td--selection')) {
        return;
      }
      if (props.disabledIds.includes(row.userId.toString())) {
        return;
      }

      // 将userId转为字符串
      const userId = row.userId.toString();

      if (props.multiple) {
        const index = checkedRowKeys.value.findIndex(key => key === userId);
        if (index > -1) {
          checkedRowKeys.value.splice(index, 1);
        } else {
          checkedRowKeys.value.push(userId);
        }
      } else {
        checkedRowKeys.value = [userId];
      }
    }
  };
}

// 监听数据变化（页面切换时）
watch(
  data,
  () => {
    updateAllPagesData();
  },
  { deep: true }
);

watch(visible, () => {
  if (visible.value) {
    getTreeData();
    if (props.searchUserIds) {
      searchParams.value.userIds = props.searchUserIds;
    }
    allPagesData.value = [];
    getDataByPage();
    checkedRowKeys.value = [...props.rowKeys];
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
    <TableSiderLayout class="bg-gray-50 p-2" :sider-title="$t('page.system.dept.title')">
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
            :scroll-x="scrollX"
            :loading="loading"
            :row-props="getRowProps"
            remote
            :row-key="row => row.userId.toString()"
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
