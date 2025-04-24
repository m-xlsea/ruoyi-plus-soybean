<script setup lang="ts">
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'OssSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.System.OssSearchParams>('model', { required: true });

async function reset() {
  await restoreValidation();
  emit('reset');
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
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="文件名" path="fileName" class="pr-24px">
              <NInput v-model:value="model.fileName" placeholder="请输入文件名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="原名" path="originalName" class="pr-24px">
              <NInput v-model:value="model.originalName" placeholder="请输入原名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="后缀名" path="fileSuffix" class="pr-24px">
              <NInput v-model:value="model.fileSuffix" placeholder="请输入后缀名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="服务商" path="service" class="pr-24px">
              <NInput v-model:value="model.service" placeholder="请输入服务商" />
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
