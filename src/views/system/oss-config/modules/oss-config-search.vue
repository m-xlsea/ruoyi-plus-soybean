<script setup lang="ts">
import { ref, toRaw } from 'vue';
import type { SelectOption } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'OssConfigSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const isDefaltOptions = ref<SelectOption[]>([
  {
    label: '是',
    value: '0'
  },
  {
    label: '否',
    value: '1'
  }
]);

const model = defineModel<Api.System.OssConfigSearchParams>('model', { required: true });

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
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="配置名称" path="configKey" class="pr-24px">
              <NInput v-model:value="model.configKey" placeholder="请输入配置名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="桶名称" path="bucketName" class="pr-24px">
              <NInput v-model:value="model.bucketName" placeholder="请输入桶名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="域" path="region" class="pr-24px">
              <NInput v-model:value="model.region" placeholder="请输入域" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="是否默认" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" placeholder="请选择是否默认" :options="isDefaltOptions" clearable />
            </NFormItemGi>
            <NFormItemGi span="24" class="pr-24px">
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
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
