<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import CryptoJS from 'crypto-js';
import { fetchCaptchaCode, fetchTenantList } from '@/service/api';
import { fetchSocialAuthBinding } from '@/service/api/system';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { localStg } from '@/utils/storage';
import { decryptWithAes, encryptWithAes } from '@/utils/crypto';
import { $t } from '@/locales';

const aesKey = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_REMEMBER_ME_AES_KEY || 'pC4aO6cD2uU7hA0bK6iD4vE1mV8sU8xG');

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const { loading: codeLoading, startLoading: startCodeLoading, endLoading: endCodeLoading } = useLoading();
const { loading: tenantLoading, startLoading: startTenantLoading, endLoading: endTenantLoading } = useLoading();

const codeUrl = ref<string>();
const captchaEnabled = ref<boolean>(false);
const registerEnabled = ref<boolean>(false);
const remberMe = ref<boolean>(false);

const tenantEnabled = ref<boolean>(false);

const tenantOption = ref<SelectOption[]>([]);

const model: Api.Auth.PwdLoginForm = reactive({
  tenantId: '000000',
  username: 'admin',
  password: 'admin123'
});

type RuleKey = Extract<keyof Api.Auth.PwdLoginForm, 'username' | 'password' | 'code' | 'tenantId'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules, createRequiredRule } = useFormRules();

  const loginRules: Record<RuleKey, App.Global.FormRule[]> = {
    username: [...formRules.userName, { required: true }],
    password: [createRequiredRule($t('form.pwd.required'))],
    code: captchaEnabled.value ? [createRequiredRule($t('form.code.required'))] : [],
    tenantId: tenantEnabled.value ? formRules.tenantId : []
  };

  return loginRules;
});

async function handleFetchTenantList() {
  startTenantLoading();
  const { data, error } = await fetchTenantList();
  if (error) return;
  tenantEnabled.value = data.tenantEnabled;
  if (data.tenantEnabled) {
    tenantOption.value = data.voList.map(tenant => {
      return {
        label: tenant.companyName,
        value: tenant.tenantId
      };
    });
  }
  endTenantLoading();
}

handleFetchTenantList();

async function handleSubmit() {
  await validate();
  // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
  if (remberMe.value) {
    const { tenantId, username, password } = model;
    localStg.set('loginRember', encryptWithAes(JSON.stringify({ tenantId, username, password }), aesKey));
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
  try {
    remberMe.value = true;
    Object.assign(model, JSON.parse(decryptWithAes(loginRember, aesKey)));
  } catch {}
}

handleLoginRember();

// async function handleRegister() {
//   const { data, error } = await fetchGetConfigDetail('sys.account.registerUser');
//   if (error) return;
//   registerEnabled.value = data.configValue === 'true';
// }

// handleRegister();

async function handleSocialLogin(type: Api.System.SocialSource) {
  const { data, error } = await fetchSocialAuthBinding(type, model.tenantId);
  if (error) return;
  window.location.href = data;
}
</script>

<template>
  <div>
    <div class="mb-5px text-32px text-black font-600 dark:text-white">登录到您的账户</div>
    <div class="pb-18px text-16px text-#858585">欢迎回来！请输入您的账户信息</div>
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
      :show-label="false"
      @keyup.enter="() => !authStore.loginLoading && handleSubmit()"
    >
      <NFormItem v-if="tenantEnabled" path="tenantId">
        <NSelect
          v-model:value="model.tenantId"
          placeholder="请选择租户"
          :options="tenantOption"
          :loading="tenantLoading"
        />
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
            <NButton :focusable="false" class="login-code h-42px w-136px" @click="handleFetchCaptchaCode">
              <img v-if="codeUrl" :src="codeUrl" />
              <NEmpty v-else :show-icon="false" description="暂无验证码" />
            </NButton>
          </NSpin>
        </div>
      </NFormItem>
      <NSpace vertical :size="12" class="mb-8px">
        <div class="mx-6px mb-8px flex-y-center justify-between">
          <NCheckbox v-model:checked="remberMe" size="large">{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
          <NA type="primary" class="text-18px" @click="toggleLoginModule('reset-pwd')">
            {{ $t('page.login.pwdLogin.forgetPassword') }}
          </NA>
        </div>
        <NButton type="primary" size="large" block :loading="authStore.loginLoading" @click="handleSubmit">
          {{ $t('common.login') }}
        </NButton>
        <NButton v-if="registerEnabled" size="large" block @click="toggleLoginModule('register')">
          {{ $t('page.login.common.register') }}
        </NButton>
      </NSpace>
    </NForm>

    <NDivider>
      <div class="color-#858585">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</div>
    </NDivider>

    <div class="w-full flex-y-center gap-16px">
      <NButton class="flex-1" @click="handleSocialLogin('gitee')">
        <template #icon>
          <icon-simple-icons-gitee class="color-#c71d23" />
        </template>
        <span class="ml-6px">Gitee</span>
      </NButton>
      <NButton class="flex-1" @click="handleSocialLogin('github')">
        <template #icon>
          <icon-mdi-github class="color-#010409" />
        </template>
        <span class="ml-6px">GitHub</span>
      </NButton>
    </div>

    <div class="mt-24px w-full text-center text-18px text-#858585">
      您还没有账户？
      <NA type="primary" class="text-18px" @click="toggleLoginModule('register')">
        {{ $t('page.login.common.register') }}
      </NA>
    </div>
  </div>
</template>

<style scoped>
.login-code {
  &.n-button {
    --n-padding: 0 8px !important;
    background-color: #c0c0c0;
  }

  img {
    height: 42px;
  }
}

:deep(.n-base-selection),
:deep(.n-input) {
  --n-height: 42px !important;
  --n-font-size: 16px !important;
  --n-border-radius: 8px !important;
}

:deep(.n-base-selection-label) {
  padding: 0 6px !important;
}

:deep(.n-checkbox) {
  --n-size: 18px !important;
  --n-font-size: 16px !important;
}

:deep(.n-button) {
  --n-height: 42px !important;
  --n-font-size: 18px !important;
  --n-border-radius: 8px !important;
}

:deep(.n-divider) {
  --n-font-size: 16px !important;
  --n-font-weight: 400 !important;
}
</style>
