<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

interface Props {
  /** 抽屉是否可见 */
  visible?: boolean;
  /** 抽屉标题 */
  title: string;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 抽屉宽度 */
  width?: number;
  /** 是否为只读模式 */
  readonly?: boolean;
  /** 是否显示暂存按钮 */
  showDraft?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  loading: false,
  width: 1200,
  readonly: false,
  showDraft: true
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
  (e: 'saveDraft'): void;
  (e: 'submit'): void;
}

const emit = defineEmits<Emits>();

const visibleValue = computed({
  get: () => props.visible,
  set: value => {
    emit('update:visible', value);
  }
});

function handleClose() {
  emit('close');
}

function handleSaveDraft() {
  emit('saveDraft');
}

function handleSubmit() {
  emit('submit');
}

defineExpose({
  handleClose,
  handleSaveDraft,
  handleSubmit
});
</script>

<template>
  <NDrawer v-model:show="visibleValue" :title="title" display-directive="show" :width="width" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable @close="handleClose">
      <NSpin :show="loading">
        <slot></slot>
      </NSpin>
      <template #footer>
        <slot name="footer">
          <div v-if="!readonly">
            <NSpace :size="16">
              <NButton @click="handleClose">{{ $t('common.cancel') }}</NButton>
              <NButton v-if="showDraft" type="warning" @click="handleSaveDraft">暂存</NButton>
              <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
            </NSpace>
          </div>
        </slot>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
