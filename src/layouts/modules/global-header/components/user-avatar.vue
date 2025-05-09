<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useBoolean } from '@sa/hooks';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';
import defaultAvatar from '@/assets/imgs/soybean.jpg';
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();

const { bool: avatarError, setTrue: setError, setFalse: clearError } = useBoolean(false);

function loginOrRegister() {
  toLogin();
}

function handleAvatarLoad() {
  clearError();
}

function handleAvatarError() {
  setError();
}

type DropdownKey = 'user-center' | 'logout';

type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: () => VNode;
    }
  | {
      type: 'divider';
      key: string;
    };

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.userCenter'),
      key: 'user-center',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 })
    },
    {
      type: 'divider',
      key: 'divider'
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];
  return opts;
});

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.logout();
    }
  });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    routerPushByKey(key);
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div class="flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors duration-300 hover:bg-black/6">
      <div class="flex items-center gap-2" :class="{ 'opacity-50': avatarError }">
        <NAvatar
          v-if="authStore.userInfo.user?.avatar"
          :size="24"
          round
          :src="authStore.userInfo.user?.avatar"
          @load="handleAvatarLoad"
          @error="handleAvatarError"
        />
        <NAvatar v-else :size="32" round :src="defaultAvatar" @load="handleAvatarLoad" @error="handleAvatarError" />
        <span class="max-w-120px truncate text-14px font-medium">
          {{ authStore.userInfo.user?.nickName }}
        </span>
      </div>
    </div>
  </NDropdown>
</template>

<style lang="scss" scoped>
.avatar-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 8px;

  &.avatar-error {
    opacity: 0.5;
  }
}

.user-name {
  font-size: 14px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
