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
  label: App.I18n.I18nKey;
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
  <div class="scroll box-border size-full flex">
    <div class="relative box-border hidden h-full w-65vw overflow-hidden bg-primary-50 xl:block dark:bg-primary-900">
      <div class="relative z-100 flex items-center pl-30px pt-30px">
        <SystemLogo class="fill-primary text-32px" />
        <h3 class="ml-10px text-20px font-400">{{ $t('system.title') }}</h3>
      </div>
      <div class="absolute inset-x-0 inset-b-10.5% inset-t-0 z-10 m-auto w-40%">
        <img class="size-full" :src="loginBackground" />
      </div>
      <div class="absolute bottom-80px w-full text-center">
        <h1 class="text-24px font-400">{{ $t('page.login.common.title') }}</h1>
        <p class="mt-8px text-14px color-gray-500">{{ $t('page.login.common.subTitle') }}</p>
      </div>
      <WaveBg />
    </div>
    <div class="relative h-full flex-1 xl:m-auto sm:!w-full">
      <header class="flex-y-center justify-between px-30px pt-30px xl:justify-end">
        <div class="relative z-100 flex items-center xl:hidden">
          <SystemLogo class="fill-primary text-32px" />
          <h3 class="ml-10px text-20px font-400">{{ $t('system.title') }}</h3>
        </div>
        <div class="flex items-center justify-end">
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
      </header>
      <main
        class="m-auto mt-10% h-630px max-w-450px w-full rounded-5px bg-cover px-24px xl:absolute xl:inset-0 lg:mt-15% xl:mt-auto"
      >
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <component :is="activeModule.component" />
        </Transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
.scroll {
  overflow: auto;
}

.scroll::-webkit-scrollbar {
  display: none;
}

.scroll {
  -ms-overflow-style: none;
}

.scroll {
  scrollbar-width: none;
}
</style>
