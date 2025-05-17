<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { menuIconTypeOptions, menuIsFrameOptions, menuTypeOptions } from '@/constants/business';
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

const iconType = ref<Api.System.IconType>('1');
const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule, createNumberRequiredRule } = useFormRules();
const queryList = ref<{ key: string; value: string }[]>([]);

const drawerTitle = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增菜单',
    edit: '编辑菜单'
  };
  return titles[props.operateType];
});

type Model = Api.System.MenuOperateParams;

const model: Model = reactive(createDefaultModel());

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
    icon: '',
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'menuName' | 'orderNum' | 'path' | 'component'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  menuName: createRequiredRule('菜单名称不能为空'),
  orderNum: createNumberRequiredRule('菜单排序不能为空'),
  path: createRequiredRule('路由地址不能为空'),
  component: createRequiredRule('组件路径不能为空')
};

const isBtn = computed(() => model.menuType === 'F');
const isMenu = computed(() => model.menuType === 'C');
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
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
    if (isMenu.value && model.isFrame === '1') {
      model.component = model.component?.slice(0, -6);
    }
    iconType.value = model.icon?.startsWith('local-icon-') ? '2' : '1';

    if (model.isFrame === '1') {
      const queryObj: { [key: string]: string } = JSON.parse(model.queryParam || '{}');
      queryList.value = Object.keys(queryObj).map(item => ({ key: item, value: queryObj[item] }));
    }
  }
}

function closeDrawer() {
  visible.value = false;
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
    remark
  } = model;

  let queryParam = model.queryParam;
  if (isFrame === '0') {
    queryParam = '';
  } else if (isFrame === '1' && queryList.value.length) {
    const queryObj: { [key: string]: string } = {};
    queryList.value.forEach(item => (queryObj[item.key] = item.value));
    queryParam = JSON.stringify(queryObj);
  }

  const path = model.path?.startsWith('/') ? model.path?.substring(1) : model.path;

  let component = model.component;
  if (isFrame === '1' && menuType === 'M') {
    component = 'Layout';
  } else if (isFrame === '2') {
    component = 'FrameView';
  } else if (isMenu.value && model.isFrame === '1') {
    component = component?.endsWith('/index') ? component : `${component}/index`;
  }

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateMenu({
      menuName,
      path,
      parentId,
      orderNum,
      queryParam,
      isFrame,
      isCache,
      menuType,
      visible: menuVisible,
      status,
      perms,
      icon,
      component,
      remark
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.addSuccess'));
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateMenu({
      menuId,
      menuName,
      path,
      parentId,
      orderNum,
      queryParam,
      isFrame,
      isCache,
      menuType,
      visible: menuVisible,
      status,
      perms,
      icon,
      component,
      remark
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.updateSuccess'));
  }

  closeDrawer();
  emit('submitted', menuType!);
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});

function onCreate() {
  return {
    key: '',
    value: ''
  };
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="drawerTitle" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi :span="24" label="上级菜单" path="pid">
            <NTreeSelect
              v-model:value="model.parentId"
              :options="treeData as []"
              label-field="menuName"
              key-field="menuId"
              :default-expanded-keys="[0]"
              placeholder="请选择上级菜单"
            />
          </NFormItemGi>
          <NFormItemGi v-if="model.menuType !== 'F'" :span="24" label="菜单类型" path="menuType">
            <NRadioGroup v-model:value="model.menuType">
              <NRadioButton
                v-for="item in menuTypeOptions.filter(item => item.value !== 'F')"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi :span="24" label="菜单名称" path="menuName">
            <NInput v-model:value="model.menuName" placeholder="请输入菜单名称" />
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" span="24" label="图标类型">
            <NRadioGroup v-model:value="iconType">
              <NRadio v-for="item in menuIconTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" span="24" path="icon">
            <template #label>
              <div class="flex-center">
                <FormTip content="iconify 地址：`https://icones.js.org`" />
                <span class="pl-3px">菜单图标</span>
              </div>
            </template>
            <template v-if="iconType === '1'">
              <NInput v-model:value="model.icon" placeholder="请输入图标" class="flex-1">
                <template #suffix>
                  <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                </template>
              </NInput>
            </template>
            <template v-if="iconType === '2'">
              <NSelect v-model:value="model.icon" placeholder="请选择本地图标" filterable :options="localIconOptions" />
            </template>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="24" path="path">
            <template #label>
              <div class="flex-center">
                <FormTip content="访问的路由地址，如：`user`，如外网地址需内链访问则以 `http(s)://` 开头" />
                <span>{{ model.isFrame !== '0' ? '路由地址' : '外链地址' }}</span>
              </div>
            </template>
            <NInput v-model:value="model.path" placeholder="请输入路由地址" />
          </NFormItemGi>
          <NFormItemGi v-if="isMenu && model.isFrame === '1'" :span="24" path="component">
            <template #label>
              <div class="flex-center">
                <FormTip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" />
                <span>组件路径</span>
              </div>
            </template>
            <NInputGroup>
              <NInputGroupLabel>views/</NInputGroupLabel>
              <NInput v-model:value="model.component" placeholder="请输入组件地址" />
              <NInputGroupLabel>/index.vue</NInputGroupLabel>
            </NInputGroup>
          </NFormItemGi>
          <NFormItemGi
            v-if="isMenu && model.isFrame !== '0'"
            span="24"
            :show-feedback="!queryList.length"
            :label="model.isFrame !== '2' ? '路由参数' : 'iframe 地址'"
          >
            <NDynamicInput
              v-if="model.isFrame !== '2'"
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
                    :rule="{ ...createRequiredRule('请输入 Key'), validator: value => isNotNull(value) }"
                  >
                    <NInput v-model:value="queryList[index].key" placeholder="Key" @keydown.enter.prevent />
                  </NFormItem>
                  <div class="mx-8px h-34px lh-34px">=</div>
                  <NFormItem
                    class="w-full"
                    ignore-path-change
                    :show-label="false"
                    :path="`query[${index}].value`"
                    :rule="{ ...createRequiredRule('请输入 Value'), validator: value => isNotNull(value) }"
                  >
                    <NInput v-model:value="queryList[index].value" placeholder="Value" @keydown.enter.prevent />
                  </NFormItem>
                </div>
              </template>
            </NDynamicInput>
            <NInput v-else v-model:value="model.queryParam" placeholder="请输入 iframe 地址" />
          </NFormItemGi>
          <NFormItemGi :span="24" path="perms">
            <template #label>
              <div class="flex-center">
                <FormTip content="控制器中定义的权限字符，如：@SaCheckPermission('system:user:list')" />
                <span>权限字符</span>
              </div>
            </template>
            <NInput v-model:value="model.perms" placeholder="请输入菜单名称" />
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="12" path="isFrame">
            <template #label>
              <div class="flex-center">
                <FormTip content="选择是外链则路由地址需要以`http(s)://`开头" />
                <span>是否外链</span>
              </div>
            </template>
            <NRadioGroup v-model:value="model.isFrame">
              <NSpace>
                <NRadio
                  v-for="option in menuIsFrameOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </NSpace>
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="isMenu" :span="12" path="isCache">
            <template #label>
              <div class="flex-center">
                <FormTip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" />
                <span>是否缓存</span>
              </div>
            </template>
            <NRadioGroup v-model:value="model.isCache">
              <NSpace>
                <NRadio value="0" label="是" />
                <NRadio value="1" label="否" />
              </NSpace>
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="!isBtn" :span="12" label="显示状态" path="visible">
            <template #label>
              <div class="flex-center">
                <FormTip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" />
                <span>显示状态</span>
              </div>
            </template>
            <DictRadio v-model:value="model.visible" dict-code="sys_show_hide" />
          </NFormItemGi>
          <NFormItemGi :span="12" path="status">
            <template #label>
              <div class="flex-center">
                <FormTip content="选择停用则路由将不会出现在侧边栏，也不能被访问" />
                <span>菜单状态</span>
              </div>
            </template>
            <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="显示排序" path="orderNum">
            <NInputNumber v-model:value="model.orderNum" placeholder="请输入排序" />
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
