<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { TagProps } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { useDict } from '@/hooks/business/dict';
import { isNotNull } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({ name: 'DictTag' });

interface Props {
  value?: string[] | number[] | string | number;
  dictCode?: string;
  immediate?: boolean;
  dictData?: Api.System.DictData;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: false,
  dictData: undefined,
  dictCode: '',
  value: () => []
});

const attrs = useAttrs() as TagProps;

const { transformDictData } = useDict(props.dictCode, props.immediate);

const dictTagData = computed<Api.System.DictData[]>(() => {
  if (props.dictData) {
    const dictData = jsonClone(props.dictData);
    if (dictData.dictLabel?.startsWith(`dict.${dictData.dictType}.`)) {
      dictData.dictLabel = $t(dictData.dictLabel as App.I18n.I18nKey);
    }
    return [dictData];
  }
  // 避免 props.value 为 0 时，无法触发
  if (props.dictCode && isNotNull(props.value)) {
    return transformDictData(props.value) || [];
  }

  return [];
});
</script>

<template>
  <div v-if="dictTagData.length">
    <NTag
      v-for="item in dictTagData"
      :key="item.dictValue"
      class="m-1"
      :class="[item.cssClass]"
      v-bind="attrs"
      :type="item.listClass || 'default'"
    >
      {{ item.dictLabel }}
    </NTag>
  </div>
</template>

<style scoped></style>
