<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { ButtonProps, PopoverPlacement } from 'naive-ui';
import { twMerge } from 'tailwind-merge';

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  zIndex?: number;
  quaternary?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  zIndex: 98,
  quaternary: true
});

const DEFAULT_CLASS = 'h-[36px] text-icon';

const attrs: ButtonProps = useAttrs();

const quaternary = computed(() => {
  return !(attrs.text || attrs.dashed || attrs.ghost) && props.quaternary;
});
</script>

<template>
  <NTooltip :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <NButton :quaternary="quaternary" :class="twMerge(DEFAULT_CLASS, props.class)" :focusable="false" v-bind="attrs">
        <div class="flex-center gap-8px">
          <slot>
            <SvgIcon :icon="icon" />
          </slot>
        </div>
      </NButton>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>

<style scoped></style>
