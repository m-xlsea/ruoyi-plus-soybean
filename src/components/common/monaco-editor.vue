<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import type { editor } from 'monaco-editor';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'MonacoEditor' });

interface Props {
  language?: string;
  readOnly?: boolean;
  valueFormat?: string;
  height?: string;
  config?: editor.IStandaloneEditorConstructionOptions;
  lineNumbers?: 'on' | 'off';
  autoToggleTheme?: boolean;
  theme?: 'vs-light' | 'vs-dark' | 'hc-black';
}

const props = withDefaults(defineProps<Props>(), {
  language: 'json',
  readOnly: false,
  valueFormat: 'string',
  lineNumbers: 'on',
  theme: 'vs-light',
  height: '150px',
  autoToggleTheme: true,
  config: () => ({
    selectOnLineNumbers: true,
    minimap: {
      enabled: false
    }
  })
});

const value = defineModel<any>('value', { required: true, default: '' });

const isActive = ref(false);
const editContainer = ref<HTMLElement | null>(null);

let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
const { darkMode: isDark } = useThemeStore();

function handleToggleTheme() {
  if (isDark) {
    monaco.editor.setTheme('vs-dark');
  } else {
    monaco.editor.setTheme('vs-light');
  }
}

/**
 * 设置文本
 *
 * @param text
 */
function setValue(text: string) {
  monacoEditor?.setValue(text || '');
}

/**
 * 光标处插入文本
 *
 * @param text
 */
function insertText(text: string) {
  // 获取光标位置
  const position = monacoEditor?.getPosition();
  // 未获取到光标位置信息
  if (!position) {
    return;
  }
  // 插入
  monacoEditor?.executeEdits('', [
    {
      range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      text
    }
  ]);
  // 设置新的光标位置
  monacoEditor?.setPosition({ ...position, column: position.column + text.length });
  // 重新聚焦
  monacoEditor?.focus();
}

onMounted(() => {
  monacoEditor = monaco.editor.create(editContainer.value as HTMLElement, {
    value: getValue(),
    ...props.config,
    language: props.language,
    readOnly: props.readOnly,
    lineNumbers: props.lineNumbers,
    theme: props.theme,
    automaticLayout: false
  });

  // 自动切换主题
  if (props.autoToggleTheme) {
    watch(
      () => isDark,
      () => {
        nextTick(() => handleToggleTheme());
      },
      {
        immediate: true
      }
    );
  }

  // 获取值
  function getValue() {
    // valueFormat 为json 格式，需要转换处理
    if (props.valueFormat === 'json') {
      if (value.value) {
        return JSON.stringify(value.value, null, 2);
      }
    }
    return value.value ?? '';
  }

  // 监听值变化
  monacoEditor.onDidChangeModelContent(() => {
    const currenValue = monacoEditor?.getValue();

    // valueFormat 为json 格式，需要转换处理
    if (props.valueFormat === 'json' && currenValue) {
      value.value = JSON.parse(currenValue);
      return;
    }

    value.value = currenValue ?? '';
  });

  const decorationsOverviewRuler = document.querySelector('.decorationsOverviewRuler');
  decorationsOverviewRuler?.removeAttribute('width');
  decorationsOverviewRuler?.removeAttribute('height');
});

watch(
  () => value.value,
  val => {
    monacoEditor?.setValue(val || '');
  }
);

watch(
  () => props.language,
  val => {
    monaco.editor.setModelLanguage(monacoEditor?.getModel() as monaco.editor.ITextModel, val);
  }
);

defineExpose({
  setValue,
  insertText
});
</script>

<template>
  <NCard
    class="h-full"
    :class="isActive ? 'code-editor-border' : ''"
    @click="() => (isActive = true)"
    @mouseout="() => (isActive = false)"
  >
    <div ref="editContainer" class="azd-code-editor" :style="{ height: height }" />
  </NCard>
</template>

<style></style>

<style lang="scss" scoped>
.n-card {
  border: 1px solid rgb(224, 224, 230) !important;

  :deep(.n-card__content) {
    padding: 6px 0 !important;
  }
}

.dark {
  .n-card {
    --n-color-modal: rgb(30, 30, 30, 1) !important;
    border: none !important;
  }
}

.n-card:hover {
  border: 1px solid rgb(var(--primary-color)) !important;
}

.code-editor-border {
  border: 1px solid rgb(var(--primary-color)) !important;
  box-shadow: 0 0 0 2px rgba(30, 94, 253, 0.2) !important;
}

.azd-code-editor {
  --n-border-radius: 3px;

  width: 100%;
  height: 100%;
  min-height: 150px;
  border-radius: var(--n-border-radius);

  :deep(.monaco-editor) {
    height: 100%;
    border-radius: var(--n-border-radius) !important;

    .overflow-guard {
      border-radius: var(--n-border-radius) !important;
    }

    .decorationsOverviewRuler,
    .scrollbar,
    .slider {
      border: 0 !important;
      width: 7px !important;
      color: rgba(0, 0, 0, 0.5) !important;
      border-radius: 7px !important;
    }

    .scroll-decoration {
      box-shadow: none !important;
    }
  }
}
</style>
