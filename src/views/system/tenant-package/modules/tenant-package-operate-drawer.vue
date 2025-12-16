<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
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

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.tenantPackage.addTenantPackage'),
    edit: $t('page.system.tenantPackage.editTenantPackage')
  };
  return titles[props.operateType];
});

type Model = Api.System.TenantPackageOperateParams;

const model = ref<Model>(createDefaultModel());

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
  packageId: createRequiredRule($t('page.system.tenantPackage.form.packageName.invalid')),
  packageName: createRequiredRule($t('page.system.tenantPackage.form.packageName.required'))
};

async function handleUpdateModelWhenEdit() {
  menuOptions.value = [];
  model.value = createDefaultModel();
  model.value.menuIds = [];

  if (props.operateType === 'add') {
    const { data, error } = await fetchGetTenantPackageMenuTreeSelect(0);
    if (error) return;
    model.value.menuIds = data.checkedKeys || [];
    menuOptions.value = data.menus;
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    startMenuLoading();
    Object.assign(model.value, jsonClone(props.rowData));
    const { data, error } = await fetchGetTenantPackageMenuTreeSelect(model.value.packageId!);
    if (error) return;
    model.value.menuIds = data.checkedKeys || [];
    menuOptions.value = data.menus;
    stopMenuLoading();
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { packageId, packageName, remark, menuCheckStrictly } = model.value;

  const menuIds = menuTreeRef.value?.getCheckedMenuIds();
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

  window.$message?.success($t('common.saveSuccess'));
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
      <NForm :model="model" :rules="rules">
        <NFormItem :label="$t('page.system.tenantPackage.packageName')" path="packageName">
          <NInput
            v-model:value="model.packageName"
            :placeholder="$t('page.system.tenantPackage.form.packageName.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.tenantPackage.menuIds')" path="menuIds">
          <MenuTree
            v-if="visible"
            ref="menuTreeRef"
            v-model:checked-keys="model.menuIds"
            v-model:options="menuOptions"
            v-model:cascade="model.menuCheckStrictly"
            v-model:loading="menuLoading"
            :immediate="false"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.tenantPackage.remark')" path="remark">
          <NInput
            v-model:value="model.remark"
            :placeholder="$t('page.system.tenantPackage.form.remark.required')"
            type="textarea"
          />
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
