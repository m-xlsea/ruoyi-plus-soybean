<script setup lang="tsx">
import { ref } from 'vue';
import { useBoolean, useLoading } from '@sa/hooks';
import type { DataTableColumns, TreeInst, TreeOption } from 'naive-ui';
import { NButton, NIcon, NInput, NPopconfirm, NTooltip } from 'naive-ui';
import { fetchDeleteMenu, fetchGetMenuList } from '@/service/api/system';
import { useAppStore } from '@/store/modules/app';
import { menuIsFrameRecord, menuTypeRecord } from '@/constants/business';
import { $t } from '@/locales';
import { handleMenuTree } from '@/utils/ruoyi';
import { useDict } from '@/hooks/business/dict';
import SvgIcon from '@/components/custom/svg-icon.vue';
import DictTag from '@/components/custom/dict-tag.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import MenuOperateDrawer from './modules/menu-operate-drawer.vue';

useDict('sys_show_hide');
useDict('sys_normal_disable');

const appStore = useAppStore();
const editingData = ref<Api.System.Menu>();
const operateType = ref<NaiveUI.TableOperateType>('add');
const { loading, startLoading, endLoading } = useLoading();
const { bool: drawerVisible, setTrue: openDrawer } = useBoolean();
const { loading: btnLoading, startLoading: startBtnLoading, endLoading: endBtnLoading } = useLoading();
/** tree pattern name , use tree search */
const name = ref<string>();
const createType = ref<Api.System.MenuType>();
const createPid = ref<CommonType.IdType>(0);
const currentMenu = ref<Api.System.Menu>();
const treeData = ref<Api.System.Menu[]>([]);
const checkedKeys = ref<CommonType.IdType[]>([0]);
const expandedKeys = ref<CommonType.IdType[]>([0]);

const menuTreeRef = ref<TreeInst>();
const btnData = ref<Api.System.MenuList>([]);

const getMeunTree = async () => {
  startLoading();
  const { data, error } = await fetchGetMenuList();
  if (error) return;
  treeData.value = [
    {
      menuId: 0,
      menuName: '根目录',
      icon: 'material-symbols:home-outline-rounded',
      children: handleMenuTree(data, 'menuId')
    }
  ] as Api.System.Menu[];
  endLoading();
};

getMeunTree();

async function handleSubmitted(menuType?: Api.System.MenuType) {
  if (menuType === 'F') {
    await getBtnMenuList();
    return;
  }
  await getMeunTree();
  if (operateType.value === 'edit') {
    currentMenu.value = menuTreeRef.value?.getCheckedData().options[0] as Api.System.Menu;
  }
}

function handleAddMenu(pid: CommonType.IdType) {
  createPid.value = pid;
  createType.value = pid === 0 ? 'M' : 'C';
  operateType.value = 'add';
  openDrawer();
}

function handleUpdateMenu() {
  operateType.value = 'edit';
  editingData.value = currentMenu.value;
  openDrawer();
}

async function handleDeleteMenu(id?: CommonType.IdType) {
  const { error } = await fetchDeleteMenu(id || checkedKeys.value[0]);
  if (error) return;
  window.$message?.success($t('common.deleteSuccess'));
  if (id) {
    getBtnMenuList();
    return;
  }
  expandedKeys.value.filter(item => !checkedKeys.value.includes(item));
  currentMenu.value = undefined;
  checkedKeys.value = [];
  getMeunTree();
}

function renderPrefix({ option }: { option: TreeOption }) {
  const renderLocalIcon = String(option.icon).startsWith('icon-');
  const icon = renderLocalIcon ? undefined : String(option.icon);
  const localIcon = renderLocalIcon ? String(option.icon).replace('icon-', 'menu-') : undefined;
  return <SvgIcon icon={icon} localIcon={localIcon} />;
}

function renderSuffix({ option }: { option: TreeOption }) {
  if (!['M'].includes(String(option.menuType))) {
    return <></>;
  }

  return (
    <>
      <div class="flex-center gap-8px">
        <ButtonIcon
          text
          class="h-18px"
          icon="ic-round-plus"
          tooltip-content="新增子菜单"
          onClick={(event: Event) => {
            event.stopPropagation();
            handleAddMenu(option.menuId as CommonType.IdType);
          }}
        />
      </div>
    </>
  );
}

function reset() {
  name.value = undefined;
  getMeunTree();
}

function handleClickTree(option: Array<TreeOption | null>) {
  checkedKeys.value = option?.map(item => item?.menuId as CommonType.IdType);

  const menu = option[0] as Api.System.Menu;
  if (menu?.menuId === 0) {
    return;
  }
  currentMenu.value = menu;
  getBtnMenuList();
}

const tagMap: Record<'0' | '1' | '2', NaiveUI.ThemeColor> = {
  '0': 'success',
  '1': 'warning',
  '2': 'primary'
};

async function getBtnMenuList() {
  if (!currentMenu.value?.menuId) {
    return;
  }
  startBtnLoading();
  btnData.value = [];
  const { data, error } = await fetchGetMenuList({ parentId: currentMenu.value?.menuId, menuType: 'F' });
  if (error) return;
  btnData.value = data || [];
  endBtnLoading();
}

function addBtnMenu() {
  operateType.value = 'add';
  createType.value = 'F';
  createPid.value = currentMenu.value?.menuId || 0;
  openDrawer();
}

function handleDeleteBtnMenu(id: CommonType.IdType) {
  handleDeleteMenu(id);
}

function handleUpdateBtnMenu(row: Api.System.Menu) {
  operateType.value = 'edit';
  editingData.value = row;
  openDrawer();
}

const btnColumns: DataTableColumns<Api.System.Menu> = [
  {
    key: 'index',
    width: 64,
    align: 'center',
    title() {
      return (
        <NButton circle type="primary" size="small" onClick={() => addBtnMenu()}>
          {{
            icon: () => (
              <NIcon>
                <SvgIcon icon="ic-round-plus" />
              </NIcon>
            )
          }}
        </NButton>
      );
    },
    render(_, index) {
      return index + 1;
    }
  },
  {
    title: '权限名称',
    key: 'menuName',
    minWidth: 120
  },
  {
    title: '权限标识',
    key: 'perms',
    align: 'center',
    minWidth: 120
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 80,
    align: 'center',
    render(row) {
      return <DictTag size="small" value={row.status} dict-code="sys_normal_disable" />;
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    minWidth: 150
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'center',
    render(row) {
      return (
        <>
          <ButtonIcon
            type="primary"
            text
            icon="ep:edit"
            tooltipContent="修改"
            onClick={() => handleUpdateBtnMenu(row)}
          />
          <NTooltip placement="bottom">
            {{
              trigger: () => (
                <NPopconfirm onPositiveClick={() => handleDeleteBtnMenu(row.menuId!)}>
                  {{
                    default: () => $t('common.confirmDelete'),
                    trigger: () => (
                      <NButton class="ml-16px h-36px text-icon" type="error" text>
                        {{
                          default: () => (
                            <div class="flex-center gap-8px">
                              <SvgIcon icon="ep:delete" />
                            </div>
                          )
                        }}
                      </NButton>
                    )
                  }}
                </NPopconfirm>
              ),
              default: () => <>{$t('common.delete')}</>
            }}
          </NTooltip>
        </>
      );
    }
  }
];
</script>

<template>
  <TableSiderLayout default-expanded>
    <template #header>菜单列表</template>
    <template #header-extra>
      <ButtonIcon
        size="small"
        icon="ic-round-plus"
        class="h-28px text-icon"
        tooltip-content="新增菜单"
        @click.stop="handleAddMenu(0)"
      />
      <ButtonIcon
        size="small"
        icon="ic-round-refresh"
        class="h-28px text-icon"
        tooltip-content="刷新"
        @click.stop="reset"
      />
    </template>
    <template #sider>
      <div class="flex gap-6px">
        <NInput v-model:value="name" size="small" placeholder="请输入菜单名称" />
      </div>
      <NSpin :show="loading" class="infinite-scroll">
        <NTree
          ref="menuTreeRef"
          v-model:checked-keys="checkedKeys"
          v-model:expanded-keys="expandedKeys"
          :cancelable="false"
          show-line
          :data="treeData as []"
          :default-expanded-keys="[0]"
          :show-irrelevant-nodes="false"
          :pattern="name"
          block-line
          class="h-full min-h-200px py-3"
          key-field="menuId"
          label-field="menuName"
          virtual-scroll
          checkable
          :render-prefix="renderPrefix"
          :render-suffix="renderSuffix"
          @update:selected-keys="(_: Array<string & number>, option: Array<TreeOption | null>) => handleClickTree(option)"
        >
          <template #empty>
            <NEmpty description="暂无菜单" class="h-full min-h-200px justify-center" />
          </template>
        </NTree>
      </NSpin>
    </template>
    <div class="h-full flex-col-stretch gap-16px">
      <template v-if="currentMenu">
        <NCard
          title="菜单详情"
          :bordered="false"
          size="small"
          class="max-h-50% card-wrapper"
          content-class="overflow-auto mb-12px"
        >
          <template #header-extra>
            <NSpace>
              <NButton
                v-if="currentMenu.menuType === 'M'"
                size="small"
                ghost
                type="primary"
                @click="handleAddMenu(currentMenu.menuId!)"
              >
                <template #icon>
                  <icon-ic-round-plus />
                </template>
                新增子菜单
              </NButton>
              <NButton size="small" ghost type="primary" @click="handleUpdateMenu">
                <template #icon>
                  <icon-ic-round-edit />
                </template>
                编辑
              </NButton>
              <NPopconfirm @positive-click="() => handleDeleteMenu()">
                <template #trigger>
                  <NButton size="small" ghost type="error" :disabled="btnData.length > 0 || btnLoading">
                    <template #icon>
                      <icon-ic-round-delete />
                    </template>
                    {{ $t('common.delete') }}
                  </NButton>
                </template>
                {{ $t('common.confirmDelete') }}
              </NPopconfirm>
            </NSpace>
          </template>
          <NDescriptions
            label-placement="left"
            size="small"
            bordered
            :column="appStore.isMobile ? 1 : 2"
            label-class="w-20% min-w-88px"
            content-class="w-100px"
          >
            <NDescriptionsItem label="菜单类型">
              <NTag size="small" type="primary">{{ menuTypeRecord[currentMenu.menuType!] }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="菜单状态">
              <DictTag size="small" :value="currentMenu.status" dict-code="sys_normal_disable" />
            </NDescriptionsItem>
            <NDescriptionsItem label="菜单名称">{{ currentMenu.menuName }}</NDescriptionsItem>
            <NDescriptionsItem v-if="currentMenu.menuType === 'C'" label="组件路径">
              {{ currentMenu.component }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="currentMenu.isFrame !== '0' ? '路由地址' : '外链地址'">
              {{ currentMenu.path }}
            </NDescriptionsItem>
            <NDescriptionsItem
              v-if="currentMenu.menuType === 'C'"
              :label="currentMenu.isFrame !== '2' ? '路由参数' : 'iframe 地址'"
            >
              {{ currentMenu.queryParam }}
            </NDescriptionsItem>
            <NDescriptionsItem v-if="currentMenu.menuType !== 'M'" label="权限标识">
              {{ currentMenu.perms }}
            </NDescriptionsItem>
            <NDescriptionsItem label="是否外链">
              <NTag v-if="currentMenu.isFrame" size="small" :type="tagMap[currentMenu.isFrame]">
                {{ menuIsFrameRecord[currentMenu.isFrame] }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="显示状态">
              <DictTag size="small" :value="currentMenu.visible" dict-code="sys_show_hide" />
            </NDescriptionsItem>
            <NDescriptionsItem v-if="currentMenu.menuType === 'C'" label="是否缓存">
              <NTag v-if="currentMenu.isCache" size="small" :type="tagMap[currentMenu.isCache]">
                {{ currentMenu.isCache === '0' ? '缓存' : '不缓存' }}
              </NTag>
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <NCard
          title="按钮权限列表"
          :bordered="false"
          size="small"
          class="h-full overflow-auto card-wrapper"
          content-class="overflow-auto mb-12px"
        >
          <template #header-extra>
            <ButtonIcon
              size="small"
              icon="ic-round-refresh"
              class="h-28px text-icon"
              tooltip-content="刷新"
              @click.stop="getBtnMenuList"
            />
          </template>
          <NDataTable class="h-full" :loading="btnLoading" :columns="btnColumns" :data="btnData" />
        </NCard>
      </template>
      <NCard v-else :bordered="false" size="small" class="h-full card-wrapper">
        <NEmpty class="h-full flex-center" size="large" />
      </NCard>
    </div>
    <MenuOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      :tree-data="treeData"
      :pid="createPid"
      :menu-type="createType"
      @submitted="handleSubmitted"
    />
  </TableSiderLayout>
</template>

<style scoped lang="scss">
:deep(.infinite-scroll) {
  height: calc(100vh - 224px - var(--calc-footer-height, 0px)) !important;
  max-height: calc(100vh - 224px - var(--calc-footer-height, 0px)) !important;
}

@media screen and (max-width: 1024px) {
  :deep(.infinite-scroll) {
    height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
    max-height: calc(100vh - 227px - var(--calc-footer-height, 0px)) !important;
  }
}

:deep(.n-spin-content) {
  height: 100%;
}

:deep(.n-tree-node-checkbox) {
  display: none;
}

:deep(.n-data-table-base-table) {
  height: 100% !important;
}

.menu-tree {
  :deep(.n-tree-node) {
    height: 33px;
  }

  :deep(.n-tree-node-switcher) {
    height: 33px;
  }

  :deep(.n-tree-node-switcher__icon) {
    font-size: 16px !important;
    height: 16px !important;
    width: 16px !important;
  }
}
</style>
