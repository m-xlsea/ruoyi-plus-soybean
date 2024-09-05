<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue';
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';
import { useLoading } from '@sa/hooks';

defineOptions({
  name: 'AppProvider'
});

const loading = useLoading(false);

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$loadingBar = useLoadingBar();
      window.$dialog = useDialog();
      window.$message = useMessage();
      window.$notification = useNotification();
      window.$loading = loading;
    }

    register();

    return () => createTextVNode();
  }
});
</script>

<template>
  <NSpin class="h-full" content-class="h-full" :show="loading.loading.value">
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

<style scoped></style>
