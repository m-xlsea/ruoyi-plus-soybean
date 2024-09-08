<script setup lang="ts">
import { createTextVNode, defineComponent, onMounted } from 'vue';
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';
import useContentLoading from '@/hooks/common/loading';
import { initWebSocket } from '@/utils/websocket';
import { initSSE } from '@/utils/sse';

defineOptions({
  name: 'AppProvider'
});

const contentLoading = useContentLoading();

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$loadingBar = useLoadingBar();
      window.$dialog = useDialog();
      window.$message = useMessage();
      window.$notification = useNotification();
      window.$loading = contentLoading;
    }

    register();

    return () => createTextVNode();
  }
});

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  initWebSocket(`${protocol + window.location.host + import.meta.env.VITE_APP_BASE_API}/resource/websocket`);
  initSSE(`${import.meta.env.VITE_APP_BASE_API}/resource/sse`);
});
</script>

<template>
  <NSpin
    class="h-full"
    :size="52"
    content-class="h-full"
    :show="contentLoading.loading.value"
    :description="contentLoading.description.value"
  >
    <NLoadingBarProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <ContextHolder />
            <slot></slot>
          </NMessageProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NSpin>
</template>

<style scoped>
:deep(.n-spin-description) {
  margin-top: 24px;
  font-size: 16px;
}
</style>
