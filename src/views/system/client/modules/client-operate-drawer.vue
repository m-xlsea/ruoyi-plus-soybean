<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
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

const { formRef, validate, restoreValidation } = useNaiveForm();
const { createRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增客户端',
    edit: '编辑客户端'
  };
  return titles[props.operateType];
});

type Model = Api.System.ClientOperateParams;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    clientKey: '',
    clientSecret: '',
    grantTypeList: [],
    deviceType: '',
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
  id: createRequiredRule('id不能为空'),
  clientKey: createRequiredRule('客户端key不能为空'),
  clientSecret: createRequiredRule('客户端秘钥不能为空'),
  grantTypeList: createRequiredRule('授权类型不能为空'),
  deviceType: createRequiredRule('设备类型不能为空'),
  activeTimeout: createRequiredRule('token活跃超时时间不能为空'),
  timeout: createRequiredRule('token固定超时不能为空')
};

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  // request
  if (props.operateType === 'add') {
    const { clientKey, clientSecret, grantTypeList, deviceType, activeTimeout, timeout, status } = model;
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
    const { id, clientId, clientKey, clientSecret, grantTypeList, deviceType, activeTimeout, timeout, status } = model;
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
        <NFormItem v-if="operateType === 'edit'" label="客户端 ID" path="clientId">
          <NInput v-model:value="model.clientId" disabled placeholder="请输入客户端 ID" />
        </NFormItem>
        <NFormItem label="客户端 key" path="clientKey">
          <NInput v-model:value="model.clientKey" :disabled="operateType === 'edit'" placeholder="请输入客户端 key" />
        </NFormItem>
        <NFormItem label="客户端秘钥" path="clientSecret">
          <NInput
            v-model:value="model.clientSecret"
            :disabled="operateType === 'edit'"
            placeholder="请输入客户端秘钥"
          />
        </NFormItem>
        <NFormItem label="授权类型" path="grantType">
          <DictSelect v-model:value="model.grantTypeList" dict-code="sys_grant_type" multiple />
        </NFormItem>
        <NFormItem label="设备类型" path="deviceType">
          <DictSelect v-model:value="model.deviceType" dict-code="sys_device_type" />
        </NFormItem>
        <NFormItem label="token活跃超时时间" path="activeTimeout">
          <template #label>
            <div class="flex-center">
              <FormTip content="指定时间无操作则过期(单位：秒), 默认30分钟(1800秒)" />
              <span class="pl-3px">token活跃超时时间</span>
            </div>
          </template>
          <NInputNumber v-model:value="model.activeTimeout" placeholder="请输入token活跃超时时间">
            <template #suffix>
              <span class="text-sm">秒</span>
            </template>
          </NInputNumber>
        </NFormItem>
        <NFormItem label="token固定超时" path="timeout">
          <template #label>
            <div class="flex-center">
              <FormTip content="指定时间必定过期(单位：秒)，默认七天(604800秒)" />
              <span class="pl-3px">token固定超时</span>
            </div>
          </template>
          <NInputNumber v-model:value="model.timeout" placeholder="请输入token固定超时">
            <template #suffix>
              <span class="text-sm">秒</span>
            </template>
          </NInputNumber>
        </NFormItem>
        <NFormItem label="状态" path="status">
          <DictRadio v-model:value="model.status" :disabled="model.id == 1" dict-code="sys_normal_disable" />
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
