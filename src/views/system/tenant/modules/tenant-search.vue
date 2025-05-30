<script setup lang="ts">
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'TenantSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.System.TenantSearchParams>('model', { required: true });

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
            <NFormItemGi span="24 s:12 m:6" label="租户编号" path="tenantId" class="pr-24px">
              <NInput v-model:value="model.tenantId as string" placeholder="请输入租户编号" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="联系人" path="contactUserName" class="pr-24px">
              <NInput v-model:value="model.contactUserName" placeholder="请输入联系人" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="联系电话" path="contactPhone" class="pr-24px">
              <NInput v-model:value="model.contactPhone" placeholder="请输入联系电话" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="企业名称" path="companyName" class="pr-24px">
              <NInput v-model:value="model.companyName" placeholder="请输入企业名称" />
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
