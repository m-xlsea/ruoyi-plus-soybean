<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useAttrs, watch } from 'vue';
import { NSpin } from 'naive-ui';
import { camelCase } from 'lodash-es';
import type { IPropTypes } from '@tinymce/tinymce-vue/lib/cjs/main/ts/components/EditorPropTypes';
import type { Editor as EditorType } from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import { plugins as defaultPlugins, toolbar as defaultToolbar } from './tinymce';

defineOptions({
  name: 'TinyMce',
  inheritAttrs: false
});

type InitOptions = IPropTypes['init'];

interface Props {
  height?: number | string;
  options?: Partial<InitOptions>;
  plugins?: string;
  toolbar?: string;
  disabled?: boolean;
  isDark?: boolean;
  locale?: string;
  uploadUrl: string;
  uploadHeaders?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  options: () => ({}),
  plugins: defaultPlugins,
  toolbar: defaultToolbar,
  disabled: false,
  isDark: false,
  locale: 'zh_CN',
  uploadHeaders: () => ({})
});

interface Emits {
  mounted: [];
}

const emit = defineEmits<Emits>();

/** https://www.jianshu.com/p/59a9c3802443 使用自托管方案（本地）代替cdn 没有key的限制 注意publicPath要以/结尾 */
const tinymceScriptSrc = new URL('../dist/tinymce.min.js', import.meta.url).href;

const content = defineModel<string | null>('modelValue', {
  default: ''
});

const editorRef = shallowRef<EditorType | null>(null);

const skinName = computed(() => {
  return props.isDark ? 'oxide-dark' : 'oxide';
});

const contentCss = computed(() => {
  return props.isDark ? 'dark' : 'default';
});

/** tinymce支持 en zh_CN */
const langName = computed(() => {
  const lang = props.locale.replace('-', '_');
  if (lang.includes('en_US')) {
    return 'en';
  }
  return 'zh_CN';
});

/** 通过v-if来挂载/卸载组件来完成主题切换切换 语言切换也需要监听 不监听在切换时候会显示原始<textarea>样式 */
const init = ref(true);
watch(
  () => [props.isDark, props.locale],
  async () => {
    if (!editorRef.value) {
      return;
    }
    // 相当于手动unmounted清理 非常重要
    editorRef.value.destroy();
    init.value = false;
    // 放在下一次tick来切换
    // 需要先加载组件 也就是v-if为true  然后需要拿到editorRef 必须放在setTimeout(相当于onMounted)
    await nextTick();
    init.value = true;
  }
);

// 取消上传
const uploadAbortController = new AbortController();
onBeforeUnmount(() => {
  uploadAbortController.abort();
});

// 加载完毕前显示spin
const loading = ref(true);
const initOptions = computed((): InitOptions => {
  const { height, options, plugins, toolbar } = props;
  return {
    auto_focus: true,
    branding: false, // 显示右下角的'使用 TinyMCE 构建'
    content_css: contentCss.value,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    contextmenu: 'link image table',
    default_link_target: '_blank',
    height,
    image_advtab: true, // 图片高级选项
    image_caption: true,
    importcss_append: true,
    language: langName.value,
    link_title: false,
    menubar: 'file edit view insert format tools table help',
    noneditable_class: 'mceNonEditable',
    /** 允许粘贴图片 默认base64格式 images_upload_handler启用时为上传 */
    paste_data_images: true,
    images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
    plugins,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    skin: skinName.value,
    toolbar,
    toolbar_mode: 'sliding',
    ...options,
    /** 覆盖默认的base64行为 */
    images_upload_handler: (blobInfo, progress) => {
      return new Promise((resolve, reject) => {
        const file = blobInfo.blob();
        const formData = new FormData();
        formData.append('file', file);
        const xhr = new XMLHttpRequest();

        // 监听上传进度
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progress(percentComplete);
          }
        });

        // 监听完成事件
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response?.data?.url);
            } catch {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({ message: `上传失败: ${xhr.responseText}`, remove: true });
            }
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: `上传失败: ${xhr.statusText}`, remove: true });
          }
        });

        // 监听错误事件
        xhr.addEventListener('error', error => {
          reject(error);
        });

        // 监听中止事件
        xhr.addEventListener('abort', () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ message: '上传已取消', remove: true });
        });

        // 初始化请求
        xhr.open('POST', props.uploadUrl, true);

        // 添加请求头
        for (const [key, value] of Object.entries(props.uploadHeaders)) {
          xhr.setRequestHeader(key, value);
        }

        // 发送请求
        xhr.send(formData);
      });
    },
    setup: editor => {
      editorRef.value = editor;
      editor.on('init', () => {
        emit('mounted');
        loading.value = false;
      });
    }
  };
});

const attrs = useAttrs();
/** 获取透传的事件 通过v-on绑定 可绑定的事件 https://www.tiny.cloud/docs/tinymce/latest/vue-ref/#event-binding */
const events = computed(() => {
  const onEvents: Record<string, any> = {};
  for (const key in attrs) {
    if (key.startsWith('on')) {
      const eventKey = camelCase(key.split('on')[1]!);
      onEvents[eventKey] = attrs[key];
    }
  }
  return onEvents;
});
</script>

<template>
  <div class="app-tinymce w-full">
    <NSpin :show="loading" class="min-h-400px w-full">
      <Editor
        v-if="init"
        v-model="content"
        class="h-full w-full"
        :init="initOptions"
        :tinymce-script-src="tinymceScriptSrc"
        :disabled="disabled"
        license-key="gpl"
        v-on="events"
      />
    </NSpin>
  </div>
</template>

<style lang="scss">
.tox.tox-silver-sink.tox-tinymce-aux {
  /** 该样式默认为1300的zIndex  */
  z-index: 2025;
}

.app-tinymce {
  /**
  隐藏右上角upgrade按钮
  */
  .tox-promotion {
    display: none;
  }
}
</style>
