<script setup lang="ts">
import { Tinymce } from '@sa/tinymce';
import { getToken } from '@/store/modules/auth/shared';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { getServiceBaseURL } from '@/utils/service';

defineOptions({
  name: 'TinymceEditor'
});

const value = defineModel<string | null>('value', { required: false, default: '' });

const appStore = useAppStore();
const themeStore = useThemeStore();

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

const headers: Record<string, string> = {
  Authorization: `Bearer ${getToken()}`,
  clientid: import.meta.env.VITE_APP_CLIENT_ID!
};
</script>

<template>
  <Tinymce
    v-model="value"
    :lang="appStore.locale"
    :is-dark="themeStore.darkMode"
    :upload-url="`${baseURL}/resource/oss/upload`"
    :upload-headers="headers"
  />
</template>

<style scoped></style>
