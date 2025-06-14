<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useEventListener } from '@vueuse/core';
import { stringify } from 'qs';
import { getToken } from '@/store/modules/auth/shared';
import { getTabIdByRoute } from '@/store/modules/tab/shared';
import { useTabStore } from '@/store/modules/tab';
import { useRouterPush } from '@/hooks/common/router';
import { getServiceBaseURL } from '@/utils/service';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

const { removeTab } = useTabStore();
const { routerPushByKey } = useRouterPush();
const route = useRoute();
const disabled = route.query.disabled === 'true';

const urlParams = {
  Authorization: `Bearer ${getToken()}`,
  id: route.query.definitionId,
  clientid: import.meta.env.VITE_APP_CLIENT_ID,
  disabled
};

const iframeUrl = `${baseURL}/warm-flow-ui/index.html?${stringify(urlParams)}`;

function messageHandler(event: MessageEvent) {
  switch (event.data.method) {
    case 'close': {
      const tabId = getTabIdByRoute(route);
      removeTab(tabId);
      routerPushByKey('workflow_process-definition');
      break;
    }
    default: {
      break;
    }
  }
}

// iframe监听组件内设计器保存事件
useEventListener('message', messageHandler);
</script>

<template>
  <iframe :src="iframeUrl" class="size-full"></iframe>
</template>
