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
            <NFormItemGi span="6 s:12 m:6" label="参数名称" path="configName" class="pr-24px">
              <NInput v-model:value="model.configName" placeholder="请输入参数名称" />
            </NFormItemGi>
            <NFormItemGi span="6 s:12 m:6" label="参数键名" path="configKey" class="pr-24px">
              <NInput v-model:value="model.configKey" placeholder="请输入参数键名" />
            </NFormItemGi>
            <NFormItemGi span="6 s:12 m:6" label="是否内置" path="configType" class="pr-24px">
              <DictSelect
                v-model:value="model.configType"
                placeholder="请选择是否内置"
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
