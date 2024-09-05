<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue';
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';
import useContentLoading from '@/hooks/common/loading';

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
