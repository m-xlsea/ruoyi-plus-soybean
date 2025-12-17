<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { menuIconTypeOptions, menuIsFrameOptions, menuLayoutOptions, menuTypeOptions } from '@/constants/business';
import { fetchCreateMenu, fetchUpdateMenu } from '@/service/api/system';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { getLocalMenuIcons } from '@/utils/icon';
import { isNotNull } from '@/utils/common';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'MenuOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Menu | null;
  /** tree option data */
  treeData?: Api.System.Menu[] | null;
  /** parent id */
  pid?: string | number;
  /** menu type */
  menuType?: Api.System.MenuType;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted', menuType: Api.System.MenuType): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const defaultIcon = import.meta.env.VITE_MENU_ICON;

const layoutType = ref<string>('0');
const iconType = ref<Api.System.IconType>('1');
const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule, createNumberRequiredRule } = useFormRules();
const queryList = ref<{ key: string; value: string }[]>([]);

const drawerTitle = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.menu.addMenu'),
    edit: $t('page.system.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Api.System.MenuOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: props.pid || 0,
    menuName: '',
    orderNum: 1,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '1',
    menuType: props.menuType || 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: defaultIcon,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'menuName' | 'orderNum' | 'path' | 'component'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  menuName: createRequiredRule($t('page.system.menu.form.menuName.invalid')),
  orderNum: createNumberRequiredRule($t('page.system.menu.form.orderNum.invalid')),
  path: createRequiredRule($t('page.system.menu.form.path.invalid')),
  component: createRequiredRule($t('page.system.menu.form.component.invalid'))
};

// 是否为目录类型
const isCatalog = computed(() => model.value.menuType === 'M');

// 是否为菜单类型
const isMenu = computed(() => model.value.menuType === 'C');

// 是否为按钮类型
const isBtn = computed(() => model.value.menuType === 'F');

// 外链类型
const isExternalType = computed(() => model.value.isFrame === '0');

// 内部类型
const isInternalType = computed(() => model.value.isFrame === '1');

// 空白布局
const isBlankLayout = computed(() => layoutType.value === '1');

// iframe类型
const isIframeType = computed(() => model.value.isFrame === '2');

// 本地图标类型
const isLocalIcon = computed(() => iconType.value === '2');

// 布局类型禁用
const layoutDisabled = computed(() => !(isMenu.value && model.value.parentId === 0));

// 本地图标
const localIcons = getLocalMenuIcons();
const localIconOptions = localIcons.map<SelectOption>(item => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={`menu-${item}`} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: `local-icon-${item}`
}));

function handleInitModel() {
  queryList.value = [];
  iconType.value = '1';
  layoutType.value = '0';
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
    const component = model.value.component;
    if (component?.startsWith('layout.blank$view.')) {
      layoutType.value = '1';
      model.value.component = component?.slice(18, component.length)?.replaceAll('_', '/');
    } else if (isMenu.value && isInternalType.value) {
      model.value.component = component?.slice(0, -6);
    }
    iconType.value = model.value.icon?.startsWith('local-icon-') ? '2' : '1';

    if (model.value.isFrame === '1') {
      const queryObj: { [key: string]: string } = JSON.parse(model.value.queryParam || '{}');
      queryList.value = Object.keys(queryObj).map(item => ({ key: item, value: queryObj[item] }));
      return;
    }

    try {
      if (model.value.isFrame === '2') {
        model.value.queryParam = JSON.parse(model.value.queryParam || '{}')?.url || '';
      }
    } catch {}
  }
}

function closeDrawer() {
  visible.value = false;
}

// 处理路径
function processPath(path: string | null | undefined): string {
  return path?.startsWith('/') ? path.substring(1) : path || '';
}

// 处理组件
function processComponent(component: string | null | undefined): string {
  if (isCatalog.value && isInternalType.value) {
    return 'Layout';
  }
  if (isIframeType.value || isExternalType.value) {
    return 'FrameView';
  }
  if (isMenu.value && isBlankLayout.value) {
    return `layout.blank$view.${component?.replaceAll('/', '_')}`;
  }
  if (isMenu.value && isInternalType.value) {
    return component?.endsWith('/index') ? component : `${component || ''}/index`;
  }
  return component || '';
}

function processQueryParam(queryParam: string | null | undefined): string {
  // 外链类型不需要查询参数
  if (isExternalType.value) {
    return '';
  }

  // 内部链接类型，处理动态参数
  if (isInternalType.value && queryList.value.length) {
    return JSON.stringify(Object.fromEntries(queryList.value.map(({ key, value }) => [key, value])));
  }

  // iframe类型，直接使用原始参数
  if (isIframeType.value) {
    return queryParam ? `{"url": "${queryParam}"}` : '';
  }

  return '';
}

async function handleSubmit() {
  await validate();

  const {
    menuId,
    parentId,
    menuName,
    orderNum,
    isFrame,
    isCache,
    menuType,
    icon,
    visible: menuVisible,
    status,
    perms,
    remark,
    component,
    queryParam
  } = model.value;

  const payload = {
    menuName,
    path: processPath(model.value.path),
    parentId,
    orderNum,
    queryParam: processQueryParam(queryParam),
    isFrame,
    isCache,
    menuType,
    visible: menuVisible,
    status,
    perms,
    icon: icon || defaultIcon,
    component: processComponent(component),
    remark
  };

  const { error } =
    props.operateType === 'add' ? await fetchCreateMenu(payload) : await fetchUpdateMenu({ ...payload, menuId });

  if (error) {
    return;
  }

  window.$message?.success($t(props.operateType === 'add' ? 'common.addSuccess' : 'common.updateSuccess'));
  closeDrawer();
  emit('submitted', menuType!);
}

watch(
  () => model.value.menuType,
  newType => {
    if (newType === 'M') {
      model.value.isFrame = '1';
    }
  }
);

watch(
  layoutDisabled,
  () => {
    if (!layoutDisabled.value) {
      return;
    }
    layoutType.value = '0';
    model.value.visible = '0';
  },
  { immediate: true }
);

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});

function handleLayoutChange(value: string) {
  model.value.visible = value as Api.Common.VisibleStatus;
}

function onCreate() {
  return {
    key: '',
    value: ''
  };
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600" class="max-w-90%">
    <NDrawerContent :title="drawerTitle" :native-scrollbar="false" closable>
      <NForm :model="model" :rules="rules">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi :span="24" :label="$t('page.system.menu.parentId')" path="pid">
            <MenuTreeSelect
              v-model:value="model.parentId"
              :immediate="false"
              :options="treeData as []"
              :placeholder="$t('page.system.menu.form.parentId.required')"
            />
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="12" :label="$t('page.system.menu.menuType')" path="menuType">
            <NRadioGroup v-model:value="model.menuType">
              <NRadioButton
                v-for="item in menuTypeOptions.filter(item => item.value !== 'F')"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi :span="12" path="layout">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.layoutTip')" />
                <span>{{ $t('page.system.menu.layout') }}</span>
              </div>
            </template>
            <NRadioGroup v-model:value="layoutType" :disabled="layoutDisabled" @update:value="handleLayoutChange">
              <NRadio v-for="item in menuLayoutOptions" :key="item.value" :value="item.value" :label="item.label" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24" :label="$t('page.system.menu.menuName')" path="menuName">
            <NInput v-model:value="model.menuName" :placeholder="$t('page.system.menu.form.menuName.required')" />
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" span="12" :label="$t('page.system.menu.iconType')">
            <NRadioGroup v-model:value="iconType">
              <NRadio v-for="item in menuIconTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" span="12" path="icon">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.iconifyTip')" />
                <span class="pl-3px">{{ $t('page.system.menu.icon') }}</span>
              </div>
            </template>
            <template v-if="isLocalIcon">
              <NSelect
                v-model:value="model.icon"
                :placeholder="$t('page.system.menu.placeholder.localIconPlaceholder')"
                filterable
                :options="localIconOptions"
              />
            </template>
            <template v-else>
              <NInput
                v-model:value="model.icon"
                :placeholder="$t('page.system.menu.placeholder.iconifyIconPlaceholder')"
                class="flex-1"
              >
                <template #suffix>
                  <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                </template>
              </NInput>
            </template>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="12" path="isFrame">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.isFrameTip')" />
                <span>{{ $t('page.system.menu.isFrame') }}</span>
              </div>
            </template>
            <NRadioGroup v-model:value="model.isFrame">
              <NSpace>
                <NRadio
                  v-for="option in menuIsFrameOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                  :disabled="option.value === '2' && isCatalog"
                />
              </NSpace>
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="isMenu" :span="12" path="isCache">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.isCacheTip')" />
                <span>{{ $t('page.system.menu.isCache') }}</span>
              </div>
            </template>
            <NRadioGroup v-model:value="model.isCache">
              <NSpace>
                <NRadio value="0" :label="$t('common.yesOrNo.yes')" />
                <NRadio value="1" :label="$t('common.yesOrNo.no')" />
              </NSpace>
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="24" path="path">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.pathTip')" />
                <span>
                  {{ !isExternalType ? $t('page.system.menu.path') : $t('page.system.menu.externalPath') }}
                </span>
              </div>
            </template>
            <NInput v-model:value="model.path" :placeholder="$t('page.system.menu.form.path.required')" />
          </NFormItemGi>
          <NFormItemGi v-if="isMenu && isInternalType" :span="24" path="component">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.componentTip')" />
                <span>{{ $t('page.system.menu.component') }}</span>
              </div>
            </template>
            <NInputGroup>
              <NInputGroupLabel>views/</NInputGroupLabel>
              <NInput v-model:value="model.component" :placeholder="$t('page.system.menu.form.path.required')" />
              <NInputGroupLabel>/index.vue</NInputGroupLabel>
            </NInputGroup>
          </NFormItemGi>
          <NFormItemGi
            v-if="isMenu && !isExternalType"
            span="24"
            :show-feedback="!queryList.length"
            :label="isInternalType ? $t('page.system.menu.query') : $t('page.system.menu.iframeQuery')"
          >
            <NDynamicInput
              v-if="isInternalType"
              v-model:value="queryList"
              item-style="margin-bottom: 0"
              :on-create="onCreate"
            >
              <template #default="{ index }">
                <div class="w-full flex">
                  <NFormItem
                    class="w-full"
                    ignore-path-change
                    :show-label="false"
                    :path="`query[${index}].key`"
                    :rule="{
                      ...createRequiredRule($t('page.system.menu.placeholder.queryKey')),
                      validator: value => isNotNull(value)
                    }"
                  >
                    <NInput v-model:value="queryList[index].key" placeholder="Key" @keydown.enter.prevent />
                  </NFormItem>
                  <div class="mx-8px h-34px lh-34px">=</div>
                  <NFormItem
                    class="w-full"
                    ignore-path-change
                    :show-label="false"
                    :path="`query[${index}].value`"
                    :rule="{
                      ...createRequiredRule($t('page.system.menu.placeholder.queryValue')),
                      validator: value => isNotNull(value)
                    }"
                  >
                    <NInput v-model:value="queryList[index].value" placeholder="Value" @keydown.enter.prevent />
                  </NFormItem>
                </div>
              </template>
            </NDynamicInput>
            <NInput
              v-else
              v-model:value="model.queryParam"
              :placeholder="$t('page.system.menu.placeholder.queryIframe')"
            />
          </NFormItemGi>
          <NFormItemGi v-if="!isCatalog" :span="24" path="perms">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.permsTip')" />
                <span>{{ $t('page.system.menu.perms') }}</span>
              </div>
            </template>
            <NInput v-model:value="model.perms" :placeholder="$t('page.system.menu.form.perms.required')" />
          </NFormItemGi>

          <NFormItemGi v-if="!isBtn" :span="12" :label="$t('page.system.menu.visible')" path="visible">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.visibleTip')" />
                <span>{{ $t('page.system.menu.visible') }}</span>
              </div>
            </template>
            <DictRadio v-model:value="model.visible" dict-code="sys_show_hide" :disabled="isBlankLayout" />
          </NFormItemGi>
          <NFormItemGi :span="12" path="status">
            <template #label>
              <div class="flex-center">
                <FormTip :content="$t('page.system.menu.statusTip')" />
                <span>{{ $t('page.system.menu.status') }}</span>
              </div>
            </template>
            <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
          </NFormItemGi>
          <NFormItemGi :span="12" :label="$t('page.system.menu.orderNum')" path="orderNum">
            <NInputNumber v-model:value="model.orderNum" :placeholder="$t('page.system.menu.form.orderNum.required')" />
          </NFormItemGi>
        </NGrid>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.save') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
