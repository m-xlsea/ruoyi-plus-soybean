<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, darkTheme } from 'naive-ui';
import type { WatermarkProps } from 'naive-ui';
import { useAppStore } from './store/modules/app';
import { useThemeStore } from './store/modules/theme';
import { useAuthStore } from './store/modules/auth';
import { naiveDateLocales, naiveLocales } from './locales/naive';

defineOptions({
  name: 'App'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const { userInfo } = useAuthStore();

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined));

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale];
});

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale];
});

const watermarkProps = computed<WatermarkProps>(() => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'RuoYi-Vue-Plus';
  const content =
    themeStore.watermark.enableUserName && userInfo.user?.userName
      ? `${userInfo.user?.nickName}@${appTitle} ${userInfo.user?.userName}`
      : appTitle;
  return {
    content,
    cross: true,
    fullscreen: true,
    fontSize: 14,
    fontColor: themeStore.darkMode ? 'rgba(200, 200, 200, 0.03)' : 'rgba(200, 200, 200, 0.2)',
    lineHeight: 14,
    width: 200,
    height: 300,
    xOffset: 12,
    yOffset: 60,
    rotate: -18,
    zIndex: 9999
  };
});
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppProvider>
      <RouterView class="bg-layout" />
      <NWatermark v-if="themeStore.watermark.visible" v-bind="watermarkProps" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
