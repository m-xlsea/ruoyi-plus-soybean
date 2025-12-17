<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchCascadeDeleteMenu } from '@/service/api/system';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import MenuTree from '@/components/custom/menu-tree.vue';

defineOptions({
  name: 'MenuCascadeDeleteModal'
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const menuTreeRef = ref<InstanceType<typeof MenuTree> | null>(null);
const menuOptions = ref<Api.System.MenuList>([]);
const { loading: menuLoading } = useLoading();

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

type Model = {
  menuIds: CommonType.IdType[];
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    menuIds: []
  };
}

type RuleKey = Extract<keyof Model, 'menuIds'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  menuIds: createRequiredRule($t('page.system.menu.form.menuIds.invalid'))
};

async function handleUpdateModelWhenEdit() {
  menuOptions.value = [];
  Object.assign(model, createDefaultModel());
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  window.$dialog?.warning({
    title: $t('page.system.menu.cascadeDelete'),
    content: $t('page.system.menu.cascadeDeleteContent'),
    positiveText: $t('common.delete'),
    positiveButtonProps: {
      type: 'error'
    },
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      const { error } = await fetchCascadeDeleteMenu(model.menuIds);
      if (error) return;
      window.$message?.success($t('common.deleteSuccess'));
      closeDrawer();
      emit('submitted');
    }
  });
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    :title="$t('page.system.menu.cascadeDelete')"
    preset="card"
    :bordered="false"
    display-directive="show"
    class="max-w-90% w-500px"
    @close="closeDrawer"
  >
    <NForm :model="model" :rules="rules">
      <NFormItem :show-label="false" path="menuIds">
        <MenuTree
          v-if="visible"
          ref="menuTreeRef"
          v-model:options="menuOptions"
          v-model:loading="menuLoading"
          v-model:checked-keys="model.menuIds"
          :cascade="true"
          :show-header="false"
          :immediate="true"
        />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
