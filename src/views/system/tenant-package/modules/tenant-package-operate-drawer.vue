<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchCreateTenantPackage, fetchUpdateTenantPackage } from '@/service/api/system/tenant-package';
import { fetchGetTenantPackageMenuTreeSelect } from '@/service/api/system/menu';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import MenuTree from '@/components/custom/menu-tree.vue';
import { $t } from '@/locales';

defineOptions({
  name: 'TenantPackageOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.TenantPackage | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const menuTreeRef = ref<InstanceType<typeof MenuTree> | null>(null);

const menuOptions = ref<Api.System.MenuList>([]);

const { loading: menuLoading, startLoading: startMenuLoading, endLoading: stopMenuLoading } = useLoading();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增租户套餐',
    edit: '编辑租户套餐'
  };
  return titles[props.operateType];
});

type Model = Api.System.TenantPackageOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    packageName: '',
    menuIds: [],
    remark: '',
    menuCheckStrictly: true
  };
}

type RuleKey = Extract<keyof Model, 'packageId' | 'packageName'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  packageId: createRequiredRule('租户套餐id不能为空'),
  packageName: createRequiredRule('租户套餐名称不能为空')
};

async function handleUpdateModelWhenEdit() {
  menuOptions.value = [];
  model.menuIds = [];

  if (props.operateType === 'add') {
    menuTreeRef.value?.refresh();
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    startMenuLoading();
    Object.assign(model, { ...props.rowData, menuIds: [] });
    const { data, error } = await fetchGetTenantPackageMenuTreeSelect(model.packageId!);
    if (error) return;
    model.menuIds = data.checkedKeys;
    menuOptions.value = data.menus;
    stopMenuLoading();
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { packageId, packageName, menuIds, remark, menuCheckStrictly } = model;
  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateTenantPackage({ packageName, menuIds, remark, menuCheckStrictly });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateTenantPackage({
      packageId,
      packageName,
      menuIds,
      remark,
      menuCheckStrictly
    });
    if (error) return;
  }

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="套餐名称" path="packageName">
          <NInput v-model:value="model.packageName" placeholder="请输入套餐名称" />
        </NFormItem>
        <NFormItem label="关联菜单" path="menuIds">
          <MenuTree
            ref="menuTreeRef"
            v-model:value="model.menuIds"
            v-model:options="menuOptions"
            v-model:cascade="model.menuCheckStrictly"
            v-model:loading="menuLoading"
            :immediate="operateType === 'add'"
          />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" placeholder="请输入备注" type="textarea" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
