<script setup lang="ts">
import { ref, watch } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useLoading } from '@sa/hooks';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/vbscript-html';
import plaintext from 'highlight.js/lib/languages/plaintext';
import { fetchGetGenPreview } from '@/service/api/tool';
import { $t } from '@/locales';

hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('plaintext', plaintext);

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
    return 'vue';
  }

  return 'plaintext';
}

function splitVueSFC(source: string) {
  const lineNumbers = source.split('\n').length;
  const scriptOpenTag = '<script setup';
  const scriptCloseTag = `<${'/'}script>`;

  // 找到 <script setup ...> 的起始位置
  const startIdx = source.indexOf(scriptOpenTag);
  if (startIdx === -1) throw new Error('未找到 <script setup>');

  // 找到 <script ...> 标签的结束位置（即第一个 >）
  const scriptTagEndIdx = source.indexOf('>', startIdx);
  const part1 = source.slice(startIdx, scriptTagEndIdx + 1);

  // 找到 <\/script>
  const endIdx = source.indexOf(scriptCloseTag);
  if (endIdx === -1) throw new Error(`未找到 <${'/'}script>`);

  // 中间脚本内容
  const part2 = source.slice(scriptTagEndIdx + 1, endIdx).trim();

  // script 后的内容
  const part3 = source.slice(endIdx).trim();

  return { part1, part2, part3, lineNumbers };
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="100%">
    <NDrawerContent title="代码预览" :native-scrollbar="false" closable>
      <NSpin :show="loading" class="h-full" content-class="h-full">
        <div class="flex flex-col">
          <NTabs
            v-model:value="tab"
            type="card"
            class="sticky top-0 h-full bg-white dark:bg-#2f2e32"
            pane-class="h-full"
          >
            <NTab v-for="(gen, index) in Object.keys(previewData)" :key="index" :name="gen" display-directive="show">
              {{ genMap[gen] }}
            </NTab>
          </NTabs>
          <div v-if="tab.endsWith('.vue.vm')" class="flex p-16px">
            <pre class="code-line-numbers">{{
              Array.from({ length: splitVueSFC(previewData[tab]).lineNumbers }, (_, i) => i + 1).join('\n')
            }}</pre>
            <div>
              <NCode :hljs="hljs" :code="splitVueSFC(previewData[tab]).part1" language="xml" />
              <NCode :hljs="hljs" :code="splitVueSFC(previewData[tab]).part2" language="typescript" />
              <NCode :hljs="hljs" :code="splitVueSFC(previewData[tab]).part3" language="xml" />
            </div>
          </div>
          <NCode
            v-else
            class="p-16px"
            :hljs="hljs"
            :code="previewData[tab]"
            :language="getGenLanguage(genMap[tab])"
            show-line-numbers
          />
          <div class="position-absolute right-42px top-58px">
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

.code-line-numbers {
  margin: 0;
  line-height: inherit;
  font-size: inherit;
  user-select: none;
  padding-right: 12px;
  text-align: right;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgb(118, 124, 130);
}
</style>
