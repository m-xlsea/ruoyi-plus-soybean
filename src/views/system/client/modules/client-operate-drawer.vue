<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { fetchCreateClient, fetchUpdateClient } from '@/service/api/system/client';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ClientOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Client | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.system.client.addClient'),
    edit: $t('page.system.client.editClient')
  };
  return titles[props.operateType];
});

type Model = Api.System.ClientOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    clientKey: '',
    clientSecret: '',
    grantTypeList: [],
    deviceType: undefined,
    activeTimeout: 1800,
    timeout: 604800,
    status: '0'
  };
}

type RuleKey = Extract<
  keyof Model,
  'id' | 'clientKey' | 'clientSecret' | 'grantTypeList' | 'deviceType' | 'activeTimeout' | 'timeout'
>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  id: createRequiredRule($t('page.system.client.form.clientId.required')),
  clientKey: createRequiredRule($t('page.system.client.form.clientKey.required')),
  clientSecret: createRequiredRule($t('page.system.client.form.clientSecret.required')),
  grantTypeList: createRequiredRule($t('page.system.client.form.grantTypeList.required')),
  deviceType: createRequiredRule($t('page.system.client.form.deviceType.required')),
  activeTimeout: createRequiredRule($t('page.system.client.form.activeTimeout.required')),
  timeout: createRequiredRule($t('page.system.client.form.timeout.required'))
};

function handleUpdateModelWhenEdit() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { id, clientId, clientKey, clientSecret, grantTypeList, deviceType, activeTimeout, timeout, status } =
    model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateClient({
      clientKey,
      clientSecret,
      grantTypeList,
      deviceType,
      activeTimeout,
      timeout,
      status
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateClient({
      id,
      clientId,
      clientKey,
      clientSecret,
      grantTypeList,
      deviceType,
      activeTimeout,
      timeout,
      status
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
        <NFormItem v-if="operateType === 'edit'" :label="$t('page.system.client.clientId')" path="clientId">
          <NInput
            v-model:value="model.clientId"
            disabled
            :placeholder="$t('page.system.client.form.clientId.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.client.clientKey')" path="clientKey">
          <NInput
            v-model:value="model.clientKey"
            :disabled="operateType === 'edit'"
            :placeholder="$t('page.system.client.form.clientKey.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.client.clientSecret')" path="clientSecret">
          <NInput
            v-model:value="model.clientSecret"
            :disabled="operateType === 'edit'"
            :placeholder="$t('page.system.client.form.clientSecret.required')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.client.grantTypeList')" path="grantTypeList">
          <DictSelect
            v-model:value="model.grantTypeList"
            :placeholder="$t('page.system.client.form.grantTypeList.required')"
            dict-code="sys_grant_type"
            multiple
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.client.deviceType')" path="deviceType">
          <DictSelect
            v-model:value="model.deviceType"
            :placeholder="$t('page.system.client.form.deviceType.required')"
            dict-code="sys_device_type"
          />
        </NFormItem>
        <NFormItem :label="$t('page.system.client.activeTimeout')" path="activeTimeout">
          <template #label>
            <div class="flex-center">
              <FormTip :content="$t('page.system.client.form.activeTimeout.tooltip')" />
              <span class="pl-3px">{{ $t('page.system.client.activeTimeout') }}</span>
            </div>
          </template>
          <NInputNumber
            v-model:value="model.activeTimeout"
            :placeholder="$t('page.system.client.form.activeTimeout.required')"
          >
            <template #suffix>
              <span class="text-sm">{{ $t('common.second') }}</span>
            </template>
          </NInputNumber>
        </NFormItem>
        <NFormItem :label="$t('page.system.client.timeout')" path="timeout">
          <template #label>
            <div class="flex-center">
              <FormTip :content="$t('page.system.client.form.timeout.tooltip')" />
              <span class="pl-3px">{{ $t('page.system.client.timeout') }}</span>
            </div>
          </template>
          <NInputNumber v-model:value="model.timeout" :placeholder="$t('page.system.client.form.timeout.required')">
            <template #suffix>
              <span class="text-sm">{{ $t('common.second') }}</span>
            </template>
          </NInputNumber>
        </NFormItem>
        <NFormItem :label="$t('page.system.client.status')" path="status">
          <DictRadio
            v-model:value="model.status"
            :placeholder="$t('page.system.client.form.status.required')"
            :disabled="model.id == 1"
            dict-code="sys_normal_disable"
          />
        </NFormItem>
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
