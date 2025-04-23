<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchCaptchaCode, fetchTenantList } from '@/service/api';
// import { fetchGetConfigDetail } from '@/service/api/system/config';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const { loading: codeLoading, startLoading: startCodeLoading, endLoading: endCodeLoading } = useLoading();

const codeUrl = ref<string>();
const captchaEnabled = ref<boolean>(false);
const tenantEnabled = ref<boolean>(false);
const registerEnabled = ref<boolean>(false);
const remberMe = ref<boolean>(false);
const tenantOption = ref<SelectOption[]>([]);

const model: Api.Auth.PwdLoginForm = reactive({
  tenantId: '000000',
  username: '',
  password: ''
});

type RuleKey = Extract<keyof Api.Auth.PwdLoginForm, 'username' | 'password' | 'code' | 'tenantId'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules, createRequiredRule } = useFormRules();

  const loginRules: Record<RuleKey, App.Global.FormRule[]> = {
    username: formRules.userName,
    password: formRules.pwd,
    code: captchaEnabled.value ? [createRequiredRule($t('form.code.required'))] : [],
    tenantId: tenantEnabled.value ? formRules.tenantId : []
  };

  return loginRules;
});

async function handleSubmit() {
  await validate();
  // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
  if (remberMe.value) {
    const { tenantId, username, password } = model;
    localStg.set('loginRember', { tenantId, username, password });
  } else {
    // 否则移除
    localStg.remove('loginRember');
  }
  try {
    await authStore.login(model);
  } catch {
    handleFetchCaptchaCode();
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

function handleLoginRember() {
  const loginRember = localStg.get('loginRember');
  if (!loginRember) return;
  remberMe.value = true;
  Object.assign(model, loginRember);
}

handleLoginRember();

// async function handleRegister() {
//   const { data, error } = await fetchGetConfigDetail('sys.account.registerUser');
//   if (error) return;
//   registerEnabled.value = data.configValue === 'true';
// }

// handleRegister();

function handleSocialLogin(type: string) {
  console.log(type);
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem v-if="tenantEnabled" path="tenantId">
      <NSelect v-model:value="model.tenantId" placeholder="请选择/输入公司名称" :options="tenantOption" />
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
    <NSpace vertical :size="16" class="mb-8px">
      <div class="mx-6px flex-y-center justify-between">
        <NCheckbox v-model:checked="remberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NSpace :size="1">
          <ButtonIcon class="color-#44b549" icon="ic:outline-wechat" @click="handleSocialLogin('wechat_enterprise')" />
          <ButtonIcon local-icon="topiam" @click="handleSocialLogin('topiam')" />
          <ButtonIcon local-icon="maxkey" @click="handleSocialLogin('maxkey')" />
          <ButtonIcon class="color-#c71d23" icon="simple-icons:gitee" @click="handleSocialLogin('gitee')" />
          <ButtonIcon class="color-#010409" icon="mdi:github" @click="handleSocialLogin('github')" />
        </NSpace>
      </div>
      <NButton type="primary" size="large" block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.login') }}
      </NButton>
      <NButton v-if="registerEnabled" size="large" block @click="toggleLoginModule('register')">
        {{ $t('page.login.common.register') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped>
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
