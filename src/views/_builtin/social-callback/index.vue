<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@sa/hooks';
import { loading as loadingHtml } from '@/plugins/loading';
import { fetchSocialLoginCallback } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';

const route = useRoute();
const authStore = useAuthStore();
const { routerPushByKey } = useRouterPush();
const { loading, startLoading, endLoading } = useLoading();

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

const processResponse = async () => {
  window.$message?.success('登录成功');
  setTimeout(() => {
    routerPushByKey('home');
  }, 2000);
};

const handleError = () => {
  setTimeout(() => {
    routerPushByKey('login');
  }, 2000);
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
  endLoading();
};

const loginByCode = async (data: Api.Auth.SocialLoginForm) => {
  try {
    await authStore.login(data);
    await processResponse();
  } catch {
    handleError();
  }
  endLoading();
};

const init = async () => {
  startLoading();
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

watch(loading, val => {
  if (val) {
    const app = document.getElementById('social-callback');
    if (app) {
      app.innerHTML = loadingHtml();
    }
  }
});
</script>

<template>
  <div v-if="loading" id="social-callback"></div>
</template>

<style scoped></style>
