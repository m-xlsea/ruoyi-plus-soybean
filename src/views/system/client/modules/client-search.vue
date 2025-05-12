<script setup lang="ts">
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ClientSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.System.ClientSearchParams>('model', { required: true });

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
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="90">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.system.client.clientKey')"
              path="clientKey"
              class="pr-24px"
            >
              <NInput v-model:value="model.clientKey" :placeholder="$t('page.system.client.form.clientKey.required')" />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.system.client.clientSecret')"
              path="clientSecret"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.clientSecret"
                :placeholder="$t('page.system.client.form.clientSecret.required')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.system.client.status')" path="status" class="pr-24px">
              <DictSelect
                v-model:value="model.status"
                :placeholder="$t('page.system.client.form.status.required')"
                dict-code="sys_normal_disable"
                clearable
              />
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
