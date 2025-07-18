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
  operateType: CommonType.WorkflowTableOperateType;
  status?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  loading: false,
  width: 1200,
  status: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
  (e: 'saveDraft'): void;
  (e: 'submit'): void;
  (e: 'approval'): void;
}

const emit = defineEmits<Emits>();

const visibleValue = computed({
  get: () => props.visible,
  set: value => {
    emit('update:visible', value);
  }
});

const showSubmit = computed(
  () =>
    props.operateType === 'add' ||
    (props.operateType === 'edit' &&
      props.status &&
      (props.status === 'draft' || props.status === 'cancel' || props.status === 'back'))
);
const showApproval = computed(() => props.operateType === 'approval' && props.status && props.status === 'waiting');

function handleClose() {
  emit('close');
}

function handleSaveDraft() {
  emit('saveDraft');
}

function handleSubmit() {
  emit('submit');
}
function handleApproval() {
  emit('approval');
}

defineExpose({
  handleClose,
  handleSaveDraft,
  handleSubmit,
  handleApproval
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
          <div>
            <NSpace :size="16">
              <NButton v-if="showSubmit || showApproval" @click="handleClose">{{ $t('common.cancel') }}</NButton>
              <NButton v-if="showSubmit" type="warning" @click="handleSaveDraft">暂存</NButton>
              <NButton v-if="showSubmit" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
              <NButton v-if="showApproval" type="primary" @click="handleApproval">办理</NButton>
            </NSpace>
          </div>
        </slot>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
