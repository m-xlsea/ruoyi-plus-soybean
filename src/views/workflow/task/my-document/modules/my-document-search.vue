<script setup lang="tsx">
import { useNaiveForm } from '@/hooks/common/form';
defineOptions({
  name: 'MyDocumentSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();
const model = defineModel<Api.Workflow.InstanceSearchParams>('model', { required: true });

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
      <NCollapseItem :title="$t('common.search')">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="6 s:12 m:6" label="流程定义编码" path="flowCode" class="pr-24px">
              <NInput v-model:value="model.flowCode" placeholder="请输入流程定义编码" />
            </NFormItemGi>
            <NFormItemGi span="6" class="pr-24px">
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
