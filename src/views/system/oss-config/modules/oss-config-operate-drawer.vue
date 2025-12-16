<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { ossAccessPolicyOptions, ossConfigIsHttpsOptions } from '@/constants/business';
import { fetchCreateOssConfig, fetchUpdateOssConfig } from '@/service/api/system/oss-config';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'OssConfigOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.OssConfig | null;
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
    add: '新增OSS配置',
    edit: '编辑OSS配置'
  };
  return titles[props.operateType];
});

type Model = Api.System.OssConfigOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    configKey: '',
    accessKey: '',
    secretKey: '',
    bucketName: '',
    prefix: '',
    endpoint: '',
    domain: '',
    isHttps: 'N',
    region: '',
    accessPolicy: '1',
    remark: ''
  };
}

type RuleKey = Extract<
  keyof Model,
  'ossConfigId' | 'configKey' | 'accessKey' | 'secretKey' | 'bucketName' | 'endpoint' | 'accessPolicy'
>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  ossConfigId: createRequiredRule('主键不能为空'),
  configKey: createRequiredRule('配置名称不能为空'),
  accessKey: createRequiredRule('accessKey不能为空'),
  secretKey: createRequiredRule('secretKey不能为空'),
  bucketName: createRequiredRule('桶名称不能为空'),
  endpoint: createRequiredRule('访问站点不能为空'),
  accessPolicy: createRequiredRule('桶权限类型不能为空')
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

  const {
    ossConfigId,
    configKey,
    accessKey,
    secretKey,
    bucketName,
    prefix,
    endpoint,
    domain,
    isHttps,
    region,
    accessPolicy,
    remark
  } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateOssConfig({
      configKey,
      accessKey,
      secretKey,
      bucketName,
      prefix,
      endpoint,
      domain,
      isHttps,
      region,
      accessPolicy,
      remark
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateOssConfig({
      ossConfigId,
      configKey,
      accessKey,
      secretKey,
      bucketName,
      prefix,
      endpoint,
      domain,
      isHttps,
      region,
      accessPolicy,
      remark
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
      <NForm :model="model" :rules="rules">
        <NDivider>基本信息</NDivider>
        <NFormItem label="配置名称" path="configKey">
          <NInput v-model:value="model.configKey" placeholder="请输入配置名称" />
        </NFormItem>
        <NFormItem label="访问站点" path="endpoint">
          <NInputGroup>
            <NSelect
              v-model:value="model.isHttps"
              class="w-110px"
              :options="ossConfigIsHttpsOptions"
              placeholder="请选择访问协议"
            />
            <NInput v-model:value="model.endpoint" placeholder="请输入访问站点" />
          </NInputGroup>
        </NFormItem>
        <NFormItem label="自定义域名" path="domain">
          <NInput v-model:value="model.domain" placeholder="请输入自定义域名" />
        </NFormItem>
        <NDivider>认证信息</NDivider>
        <NFormItem label="accessKey" path="accessKey">
          <NInput v-model:value="model.accessKey" placeholder="请输入 AccessKey" />
        </NFormItem>
        <NFormItem label="secretKey" path="secretKey">
          <NInput v-model:value="model.secretKey" placeholder="请输入秘钥 SecretKey" />
        </NFormItem>
        <NDivider>桶信息</NDivider>
        <NFormItem label="桶名称" path="bucketName">
          <NInput v-model:value="model.bucketName" placeholder="请输入桶名称" />
        </NFormItem>
        <NFormItem label="前缀" path="prefix">
          <NInput v-model:value="model.prefix" placeholder="请输入前缀" />
        </NFormItem>
        <NGrid :cols="2" :x-gap="24">
          <NGridItem>
            <NFormItem label="桶权限类型" path="accessPolicy">
              <NRadioGroup v-model:value="model.accessPolicy">
                <NSpace>
                  <NRadio
                    v-for="option in ossAccessPolicyOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  />
                </NSpace>
              </NRadioGroup>
            </NFormItem>
          </NGridItem>
        </NGrid>
        <NFormItem label="域" path="region">
          <NInput v-model:value="model.region" placeholder="请输入域" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" :rows="3" type="textarea" placeholder="请输入备注" />
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
