<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchCaptchaCode, fetchRegister, fetchTenantList } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'Register'
});

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const { loading: codeLoading, startLoading: startCodeLoading, endLoading: endCodeLoading } = useLoading();
const { loading: registerLoading, startLoading: startRegisterLoading, endLoading: endRegisterLoading } = useLoading();

const codeUrl = ref<string>();
const captchaEnabled = ref<boolean>(false);
const tenantEnabled = ref<boolean>(false);
const tenantOption = ref<SelectOption[]>([]);

const model: Api.Auth.RegisterForm = reactive({
  tenantId: '000000',
  username: '',
  code: '',
  password: '',
  confirmPassword: '',
  userType: 'sys_user'
});

type RuleKey = Extract<keyof Api.Auth.RegisterForm, 'username' | 'password' | 'confirmPassword' | 'code' | 'tenantId'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule, createRequiredRule } = useFormRules();

  return {
    tenantId: tenantEnabled.value ? formRules.tenantId : [],
    username: [...formRules.userName, { required: true }],
    password: [...formRules.pwd, { required: true }],
    confirmPassword: createConfirmPwdRule(model.password!),
    code: captchaEnabled.value ? [createRequiredRule($t('form.code.required'))] : []
  };
});

async function handleSubmit() {
  try {
    await validate();
    startRegisterLoading();
    const { error } = await fetchRegister({
      tenantId: model.tenantId,
      username: model.username,
      password: model.password,
      code: model.code,
      uuid: model.uuid,
      grantType: 'password',
      userType: model.userType,
      clientId: import.meta.env.VITE_APP_CLIENT_ID
    });
    if (error) {
      handleFetchCaptchaCode();
      return;
    }
    window.$message?.success('注册成功');
    // 注册成功后跳转到登录页
    toggleLoginModule('pwd-login');
  } catch {
    handleFetchCaptchaCode();
  } finally {
    endRegisterLoading();
  }
}

async function handleFetchTenantList() {
  const { data, error } = await fetchTenantList();
  if (error) return;
  tenantEnabled.value = data.tenantEnabled;
  tenantOption.value = data.voList.map(tenant => {
    return {
      label: tenant.companyName,
      value: tenant.tenantId
    };
  });
}

handleFetchTenantList();

async function handleFetchCaptchaCode() {
  startCodeLoading();
  const { data, error } = await fetchCaptchaCode();
  if (!error) {
    captchaEnabled.value = data.captchaEnabled;
    if (data.captchaEnabled) {
      model.uuid = data.uuid;
      codeUrl.value = `data:image/gif;base64,${data.img}`;
    }
  }
  endCodeLoading();
}

handleFetchCaptchaCode();
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    size="large"
    :show-label="false"
    @keyup.enter="() => !registerLoading && handleSubmit()"
  >
    <NFormItem v-if="tenantEnabled" path="tenantId">
      <NSelect v-model:value="model.tenantId" :options="tenantOption" :enabled="tenantEnabled" />
    </NFormItem>
    <NFormItem path="username">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      />
    </NFormItem>
    <NFormItem v-if="captchaEnabled" path="code">
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <NSpin :show="codeLoading" :size="28" class="h-42px">
          <NButton :focusable="false" class="login-code h-42px w-116px" @click="handleFetchCaptchaCode">
            <img v-if="codeUrl" :src="codeUrl" />
            <NEmpty v-else :show-icon="false" description="暂无验证码" />
          </NButton>
        </NSpin>
      </div>
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" block :loading="registerLoading" @click="handleSubmit">
        {{ $t('page.login.common.register') }}
      </NButton>
      <NButton size="large" block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped lang="scss">
.login-code {
  &.n-button {
    --n-padding: 0 8px !important;
    background-color: #c0c0c0;
  }

  img {
    height: 40px;
  }
}
</style>
