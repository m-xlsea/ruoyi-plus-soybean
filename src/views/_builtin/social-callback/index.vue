<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getRgb } from '@sa/color';
import { DARK_CLASS } from '@/constants/app';
import { fetchSocialLoginCallback } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { toggleHtmlClass } from '@/utils/common';

const route = useRoute();
const authStore = useAuthStore();
const { routerPushByKey } = useRouterPush();

/**
 * 接收Route传递的参数
 *
 * @param {Object} route.query.
 */
const code = route.query.code as string;
const state = route.query.state as string;
const source = route.query.source as string;
const stateJson = state ? JSON.parse(atob(state)) : {};
const tenantId = (stateJson.tenantId as string) ?? '000000';
const domain = (stateJson.domain as string) ?? window.location.host;
const msg = ref('正在登录，请稍后......');

const processResponse = async () => {
  window.$message?.success('登录成功');
  msg.value = '登录成功，2s 后即将跳转至首页';
  setTimeout(() => {
    msg.value = '登录成功，1s 后即将跳转至首页';
  }, 1000);
  setTimeout(() => {
    routerPushByKey(import.meta.env.VITE_ROUTE_HOME || 'home');
  }, 1000);
};

const handleError = () => {
  msg.value = '登录失败，2s 后即将跳转至登录页';
  setTimeout(() => {
    msg.value = '登录失败，1s 后即将跳转至登录页';
  }, 1000);
  setTimeout(() => {
    routerPushByKey('login');
  }, 1000);
};

const callbackByCode = async (data: Api.Auth.SocialLoginForm) => {
  const { error } = await fetchSocialLoginCallback({
    ...data,
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    grantType: 'social'
  });
  if (error) {
    handleError();
    return;
  }
  await processResponse();
};

const loginByCode = async (data: Api.Auth.SocialLoginForm) => {
  try {
    await authStore.logout();
    await authStore.login(data);
    await processResponse();
  } catch {
    handleError();
  }
};

const init = async () => {
  // 如果域名不相等 则重定向处理
  const host = window.location.host;
  if (domain !== host) {
    const urlFull = new URL(window.location.href);
    urlFull.host = domain;
    window.location.href = urlFull.toString();
    return;
  }

  const data: Api.Auth.SocialLoginForm = {
    socialCode: code,
    socialState: state,
    tenantId,
    source,
    grantType: 'social'
  };

  if (!authStore.isLogin) {
    await loginByCode(data);
  } else {
    await callbackByCode(data);
  }
};

onMounted(async () => {
  await init();
});

const themeColor = localStg.get('themeColor') || '#2080f0';
const darkMode = localStg.get('darkMode') || false;
const { r, g, b } = getRgb(themeColor);

if (darkMode) {
  toggleHtmlClass(DARK_CLASS).add();
}

const primaryColor = `--primary-color: ${r} ${g} ${b}`;
</script>

<template>
  <div class="fixed-center flex-col bg-layout" :style="primaryColor">
    <div class="my-52px h-120px w-120px">
      <!-- From Uiverse.io by SchawnnahJ -->
      <div class="loader"></div>
    </div>
    <h2 class="text-30px text-primary-400 font-500">{{ msg }}</h2>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/scss/loading.scss';
</style>
