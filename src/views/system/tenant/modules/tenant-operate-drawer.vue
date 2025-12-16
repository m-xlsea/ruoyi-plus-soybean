<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
import { fetchCreateTenant, fetchUpdateTenant } from '@/service/api/system/tenant';
import { fetchGetTenantPackageSelectList } from '@/service/api/system/tenant-package';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'TenantOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.System.Tenant | null;
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
const { createRequiredRule, patternRules } = useFormRules();
const { loading: packageLoading, startLoading: startPackageLoading, endLoading: endPackageLoading } = useLoading();
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增租户',
    edit: '编辑租户'
  };
  return titles[props.operateType];
});

type Model = Api.System.TenantOperateParams;

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    tenantId: '',
    contactUserName: '',
    contactPhone: '',
    companyName: '',
    licenseNumber: '',
    address: '',
    intro: '',
    domain: '',
    remark: '',
    packageId: null,
    expireTime: null,
    accountCount: null,
    status: '0',
    username: '',
    password: ''
  };
}

type RuleKey = Extract<
  keyof Model,
  'id' | 'contactUserName' | 'contactPhone' | 'companyName' | 'packageId' | 'accountCount' | 'username' | 'password'
>;

const rules: Record<RuleKey, App.Global.FormRule | App.Global.FormRule[]> = {
  id: createRequiredRule('id不能为空'),
  contactUserName: createRequiredRule('联系人不能为空'),
  contactPhone: [createRequiredRule('联系电话不能为空'), { ...patternRules.phone, trigger: ['blur', 'change'] }],
  companyName: createRequiredRule('企业名称不能为空'),
  packageId: createRequiredRule('租户套餐不能为空'),
  accountCount: createRequiredRule('用户数量不能为空'),
  username: [
    createRequiredRule('管理员账号不能为空'),
    {
      min: 2,
      max: 20,
      message: '账号长度必须介于2-20之间',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    createRequiredRule('管理员密码不能为空'),
    {
      min: 5,
      max: 20,
      message: '密码长度必须介于5-20之间',
      trigger: ['blur', 'change']
    }
  ]
};

/** the enabled package options */
const packageOptions = ref<CommonType.Option<CommonType.IdType>[]>([]);
async function getPackageOptions() {
  startPackageLoading();
  const { error, data } = await fetchGetTenantPackageSelectList();
  if (!error) {
    packageOptions.value = data.map(item => ({
      label: item.packageName,
      value: item.packageId
    }));
  }
  endPackageLoading();
}

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
    id,
    tenantId,
    contactUserName,
    contactPhone,
    companyName,
    username,
    password,
    licenseNumber,
    address,
    intro,
    domain,
    remark,
    packageId,
    expireTime,
    accountCount,
    status
  } = model.value;

  // request
  if (props.operateType === 'add') {
    const { error } = await fetchCreateTenant({
      contactUserName,
      contactPhone,
      companyName,
      username,
      password,
      licenseNumber,
      address,
      intro,
      domain,
      remark,
      packageId,
      expireTime,
      accountCount,
      status
    });
    if (error) return;
  }

  if (props.operateType === 'edit') {
    const { error } = await fetchUpdateTenant({
      id,
      tenantId,
      contactUserName,
      contactPhone,
      companyName,
      licenseNumber,
      address,
      intro,
      domain,
      remark,
      packageId,
      expireTime,
      accountCount,
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
    getPackageOptions();
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
        <NFormItem label="企业名称" path="companyName">
          <NInput v-model:value="model.companyName" placeholder="请输入企业名称" />
        </NFormItem>
        <NFormItem label="联系人" path="contactUserName">
          <NInput v-model:value="model.contactUserName" placeholder="请输入联系人" />
        </NFormItem>
        <NFormItem label="联系电话" path="contactPhone">
          <NInput v-model:value="model.contactPhone" placeholder="请输入联系电话" />
        </NFormItem>
        <div v-if="props.operateType === 'add'">
          <NDivider>管理员信息</NDivider>
          <NFormItem label="管理员账号" path="username">
            <NInput v-model:value="model.username" placeholder="请输入管理员账号" />
          </NFormItem>
          <NFormItem label="管理员密码" path="password">
            <NInput
              v-model:value="model.password"
              type="password"
              show-password-on="click"
              placeholder="请输入管理员密码"
            />
          </NFormItem>
        </div>
        <NDivider>租户设置</NDivider>
        <NFormItem label="租户套餐" path="packageId">
          <NSelect
            v-model:value="model.packageId"
            clearable
            :disabled="props.operateType === 'edit'"
            placeholder="请选择租户套餐"
            :options="packageOptions"
            :loading="packageLoading"
          />
        </NFormItem>
        <NFormItem label="过期时间" path="expireTime">
          <NDatePicker
            v-model:formatted-value="model.expireTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            class="w-full"
          />
        </NFormItem>
        <NFormItem path="accountCount">
          <template #label>
            <div class="flex-center">
              <FormTip content="-1不限制用户数量" />
              <span>用户数量</span>
            </div>
          </template>
          <NInputNumber v-model:value="model.accountCount" placeholder="请输入用户数量" min="-1" class="w-full" />
        </NFormItem>
        <NFormItem path="domain">
          <template #label>
            <div class="flex-center">
              <FormTip
                content="可填写域名/端口 填写域名如: www.test.com 或者 www.test.com:8080 填写ip:端口如: 127.0.0.1:8080"
              />
              <span>绑定域名</span>
            </div>
          </template>
          <NInputGroup>
            <NInputGroupLabel>http(s)://</NInputGroupLabel>
            <NInput v-model:value="model.domain" placeholder="请输入" />
          </NInputGroup>
        </NFormItem>
        <NFormItem label="租户状态" path="status">
          <DictRadio v-model:value="model.status" dict-code="sys_normal_disable" />
        </NFormItem>
        <NDivider>企业信息</NDivider>
        <NFormItem label="企业地址" path="address">
          <NInput v-model:value="model.address" placeholder="请输入企业地址" />
        </NFormItem>
        <NFormItem label="企业代码" path="licenseNumber">
          <NInput v-model:value="model.licenseNumber" placeholder="请输入企业代码" />
        </NFormItem>
        <NFormItem label="企业简介" path="intro">
          <NInput v-model:value="model.intro" type="textarea" placeholder="请输入企业简介" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput v-model:value="model.remark" type="textarea" placeholder="请输入备注" />
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
@/service/api/system/tenant-package
