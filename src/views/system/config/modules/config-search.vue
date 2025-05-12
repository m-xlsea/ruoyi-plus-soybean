<script setup lang="ts">
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ConfigSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.System.ConfigSearchParams>('model', { required: true });

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
            <NFormItemGi
              span="6 s:12 m:6"
              :label="$t('page.system.config.configName')"
              path="configName"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.configName"
                :placeholder="$t('page.system.config.form.configName.required')"
              />
            </NFormItemGi>
            <NFormItemGi span="6 s:12 m:6" :label="$t('page.system.config.configKey')" path="configKey" class="pr-24px">
              <NInput v-model:value="model.configKey" :placeholder="$t('page.system.config.form.configKey.required')" />
            </NFormItemGi>
            <NFormItemGi
              span="6 s:12 m:6"
              :label="$t('page.system.config.configType')"
              path="configType"
              class="pr-24px"
            >
              <DictSelect
                v-model:value="model.configType"
                :placeholder="$t('page.system.config.form.configType.required')"
                dict-code="sys_yes_no"
                clearable
              />
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

<style scoped></style>
