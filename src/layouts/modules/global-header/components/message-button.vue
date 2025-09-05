<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useNoticeStore } from '@/store/modules/notice';

defineOptions({
  name: 'MessgaeButton'
});

const show = ref(false);
const noticeStore = useNoticeStore();
const { state } = storeToRefs(noticeStore);

const noticeNum = computed(() => {
  return state.value.notices.filter(notice => !notice.read).length || 0;
});

const toGitee = () => {
  window.open('https://gitee.com/xlsea/ruoyi-plus-soybean', '_blank');
};
</script>

<template>
  <NPopover v-model:show="show" trigger="click" arrow-point-to-center raw class="border-rounded-6px">
    <template #trigger>
      <NTooltip :disabled="show">
        <template #trigger>
          <NButton quaternary class="bell-button h-36px text-icon" :focusable="false">
            <NBadge :value="noticeNum" :max="99" :offset="[2, -2]">
              <div class="bell-icon flex-center gap-8px">
                <SvgIcon local-icon="bell" />
              </div>
            </NBadge>
          </NButton>
        </template>
        {{ $t('page.home.message') }}
      </NTooltip>
    </template>
    <NCard
      size="small"
      :bordered="false"
      class="w-345px"
      header-class="p-0"
      :segmented="{ content: true, footer: 'soft' }"
    >
      <template #header>
        <span>通知公告</span>
      </template>
      <template #header-extra>
        <NTooltip placement="left" :z-index="98">
          <template #trigger>
            <NPopconfirm @positive-click="() => noticeStore.readAll()">
              <template #trigger>
                <NButton quaternary>
                  <div class="flex-center gap-8px">
                    <SvgIcon icon="lucide:mail-check" class="text-16px" />
                  </div>
                </NButton>
              </template>
              确定全部已读吗？
            </NPopconfirm>
          </template>
          一键已读
        </NTooltip>
      </template>
      <NScrollbar class="h-260px">
        <template v-if="state?.notices?.length">
          <template v-for="(message, index) in state?.notices" :key="index">
            <NDivider v-show="index !== 0" />
            <div class="flex cursor-pointer" @click="() => noticeStore.readNotice(message)">
              <div class="flex-col justify-between gap-3px">
                <NEllipsis class="w-260px">{{ message.message }}</NEllipsis>
                <span class="text-#898989">
                  {{ message.time }}
                </span>
              </div>
              <div>
                <NTag :type="message.read ? 'success' : 'error'">{{ message.read ? '已读' : '未读' }}</NTag>
              </div>
            </div>
          </template>
        </template>
        <NEmpty v-else class="h-180px flex-center" />
      </NScrollbar>
      <template #footer>
        <div class="flex items-center justify-end">
          <NButton type="primary" size="small" @click="toGitee">前往 Gitee</NButton>
        </div>
      </template>
    </NCard>
  </NPopover>
</template>

<style scoped lang="scss">
:deep(.n-divider) {
  margin: 12px 0;
}

:deep(.n-thing-header) {
  margin-bottom: 1px !important;
}

:deep(.n-thing-main__content) {
  margin-top: 0 !important;
}

:deep(.messgae-popover) {
  padding: 0 !important;
}

:deep(.n-badge-sup) {
  padding: 0 5px !important;
  font-size: 10px !important;
  height: 15px !important;
  line-height: 15px !important;
}

.bell-button {
  &:hover {
    .bell-icon {
      animation: bell-ring 1s both;
    }
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-10deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-5deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}
</style>
