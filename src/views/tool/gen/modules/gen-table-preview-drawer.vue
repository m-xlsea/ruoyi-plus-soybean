<script setup lang="ts">
import { ref, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useLoading } from '@sa/hooks';
import { fetchGetGenPreview } from '@/service/api/tool';
import MonacoEditor from '@/components/common/monaco-editor.vue';

defineOptions({
  name: 'GenTablePreviewDrawer'
});

interface Props {
  /** the edit row data */
  rowData?: Api.Tool.GenTable | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const tab = ref('vm/java/domain.java.vm');
const previewData = ref<Api.Tool.GenTablePreview>({});
const { loading, startLoading, endLoading } = useLoading();

async function getGenPreview() {
  if (!props.rowData?.tableId) return;
  startLoading();
  const { data, error } = await fetchGetGenPreview(props.rowData?.tableId);
  if (error) {
    endLoading();
    closeDrawer();
    return;
  }
  previewData.value = data;
  endLoading();
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  closeDrawer();
  emit('submitted');
}

const { copy, isSupported } = useClipboard();

async function handleCopyCode() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }

  const code = previewData.value[tab.value];

  if (!previewData.value[tab.value]) {
    return;
  }

  await copy(code);
  window.$message?.success('代码复制成功');
}

watch(visible, () => {
  if (visible.value) {
    previewData.value = {};
    tab.value = 'vm/java/domain.java.vm';
    getGenPreview();
  }
});

const genMap: Api.Tool.GenTablePreview = {
  'vm/java/domain.java.vm': 'domain.java',
  'vm/java/vo.java.vm': 'vo.java',
  'vm/java/bo.java.vm': 'bo.java',
  'vm/java/mapper.java.vm': 'mapper.java',
  'vm/java/service.java.vm': 'service.java',
  'vm/java/serviceImpl.java.vm': 'serviceImpl.java',
  'vm/java/controller.java.vm': 'controller.java',
  'vm/xml/mapper.xml.vm': 'mapper.xml',
  'vm/sql/sql.vm': 'sql',
  'vm/soy/api/api.ts.vm': 'api.ts',
  'vm/soy/typings/api.d.ts.vm': 'type.d.ts',
  'vm/soy/index.vue.vm': 'index.vue',
  'vm/soy/index-tree.vue.vm': 'index-tree.vue',
  'vm/soy/modules/search.vue.vm': 'search.vue',
  'vm/soy/modules/operate-drawer.vue.vm': 'operate-drawer.vue'
};

function getGenLanguage(name: string) {
  if (name.endsWith('.java')) {
    return 'java';
  }

  if (name.endsWith('.xml')) {
    return 'xml';
  }

  if (name.endsWith('sql')) {
    return 'sql';
  }

  if (name.endsWith('.ts')) {
    return 'typescript';
  }

  if (name.endsWith('.vue')) {
    return 'html';
  }

  return 'plaintext';
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="100%">
    <NDrawerContent title="代码预览" :native-scrollbar="false" closable>
      <NSpin :show="loading" class="h-full" content-class="h-full">
        <div class="flex flex-row">
          <NTabs v-model:value="tab" type="line" placement="left" class="h-full" pane-class="h-full">
            <NTab v-for="(gen, index) in Object.keys(previewData)" :key="index" :name="gen" display-directive="show">
              {{ genMap[gen] }}
            </NTab>
          </NTabs>
          <MonacoEditor
            v-model:value="previewData[tab]"
            class="tab-pane"
            read-only
            :language="getGenLanguage(genMap[tab])"
            height="calc(100vh - 162px)"
          />
          <div class="position-absolute right-42px top-2px">
            <NButton text :focusable="false" class="flex-center" @click="handleCopyCode">
              <template #icon>
                <icon-ep-copy-document class="text-14px" />
              </template>
              <span>复制</span>
            </NButton>
          </div>
        </div>
      </NSpin>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton :disabled="loading" type="primary" @click="handleSubmit">生成代码</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
:deep(.n-drawer-body-content-wrapper) {
  height: 100%;
}

:deep(.n-tabs) {
  width: unset !important;
}

:deep(.n-tabs.n-tabs--left .n-tabs-bar) {
  width: 5px !important;
}

.tab-pane {
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: 12px;
}
</style>
