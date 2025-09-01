<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import loginBackground from '@/assets/svg-icon/login-background.svg';
import { $t } from '@/locales';
import PwdLogin from './modules/pwd-login.vue';
import CodeLogin from './modules/code-login.vue';
import Register from './modules/register.vue';
import ResetPwd from './modules/reset-pwd.vue';
import BindWechat from './modules/bind-wechat.vue';

interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();

interface LoginModule {
  label: string;
  component: Component;
}

const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  'code-login': { label: loginModuleRecord['code-login'], component: CodeLogin },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
  'bind-wechat': { label: loginModuleRecord['bind-wechat'], component: BindWechat }
};

const activeModule = computed(() => moduleMap[props.module || 'pwd-login']);
</script>

<template>
  <div class="box-border size-full flex">
    <div class="relative box-border hidden h-full w-65vw overflow-hidden bg-primary-50 xl:block dark:bg-primary-900">
      <div class="relative z-100 flex items-center pl-30px pt-30px">
        <SystemLogo class="text-32px text-primary" />
        <h3 class="ml-10px text-20px font-400">{{ $t('system.title') }}</h3>
      </div>
      <div class="absolute inset-x-0 inset-b-10.5% inset-t-0 z-10 m-auto w-40%">
        <img class="size-full" :src="loginBackground" />
      </div>
      <div class="absolute bottom-80px w-full text-center">
        <h1 class="text-24px font-400">{{ $t('page.login.common.title') }}</h1>
        <p class="mt-8px text-14px color-gray-500">{{ $t('page.login.common.subTitle') }}</p>
      </div>
    </div>
    <header class="relative h-full flex-1 xl:m-auto sm:!w-full">
      <div class="relative z-100 block flex items-center pl-30px pt-30px xl:hidden">
        <SystemLogo class="text-32px text-primary" />
        <h3 class="ml-10px text-20px font-400">{{ $t('system.title') }}</h3>
      </div>
      <div class="position-fixed right-30px top-24px z-100 flex items-center justify-end">
        <div class="ml-15px inline-block flex cursor-pointer select-none p-5px">
          <ThemeSchemaSwitch
            :theme-schema="themeStore.themeScheme"
            :show-tooltip="false"
            class="text-20px lt-sm:text-18px"
            @switch="themeStore.toggleThemeScheme"
          />
          <LangSwitch
            v-if="themeStore.header.multilingual.visible"
            :lang="appStore.locale"
            :lang-options="appStore.localeOptions"
            :show-tooltip="false"
            class="text-20px lt-sm:text-18px"
            @change-lang="appStore.changeLocale"
          />
        </div>
      </div>
      <main class="absolute inset-0 m-auto h-630px max-w-450px w-full overflow-hidden rounded-5px bg-cover px-24px">
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <component :is="activeModule.component" />
        </Transition>
      </main>
    </header>
  </div>
</template>

<style scoped></style>
