<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'GenTableDbSearch'
});

interface Props {
  options: CommonType.Option[];
}

defineProps<Props>();

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.Tool.GenTableDbSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  await restoreValidation();
  resetModel();
  emit('search');
}
async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NForm :model="model" label-placement="left" :label-width="80">
    <NGrid responsive="screen" item-responsive>
      <NFormItemGi span="24 s:12" label="数据源" label-width="auto" path="dataName" class="pr-24px">
        <NSelect v-model:value="model.dataName" :options="options" placeholder="请选择数据源" />
      </NFormItemGi>
      <NFormItemGi span="24 s:12" label="表名称" label-width="auto" path="tableName" class="pr-24px">
        <NInput v-model:value="model.tableName" placeholder="请输入表名称" />
      </NFormItemGi>
      <NFormItemGi span="24 s:12" label="表描述" label-width="auto" path="tableComment" class="pr-24px">
        <NInput v-model:value="model.tableComment" placeholder="请输入表描述" />
      </NFormItemGi>
      <NFormItemGi :show-feedback="false" span="24 s:12" class="pb-6px pr-24px">
        <NSpace class="w-full" justify="end">
          <NButton @click="reset">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.reset') }}
          </NButton>
          <NButton type="primary" ghost @click="search">
            <template #icon>
              <icon-ic-round-search class="text-icon" />
            </template>
            {{ $t('common.search') }}
          </NButton>
        </NSpace>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
