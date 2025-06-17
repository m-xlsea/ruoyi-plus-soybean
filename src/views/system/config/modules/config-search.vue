<script setup lang="ts">
import { ref } from 'vue';
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

const dateRangeCreateTime = ref<[string, string] | null>(null);

const model = defineModel<Api.System.ConfigSearchParams>('model', { required: true });

function onDateRangeCreateTimeUpdate(value: [string, string] | null) {
  if (value?.length) {
    model.value.params!.beginTime = value[0];
    model.value.params!.endTime = value[1];
  }
}

async function reset() {
  dateRangeCreateTime.value = null;
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
              span="24 s:12 m:6"
              :label="$t('page.system.config.configName')"
              path="configName"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.configName"
                :placeholder="$t('page.system.config.form.configName.required')"
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.system.config.configKey')"
              path="configKey"
              class="pr-24px"
            >
              <NInput v-model:value="model.configKey" :placeholder="$t('page.system.config.form.configKey.required')" />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
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
            <NFormItemGi span="24 s:12 m:12" label="创建时间" path="createTime" class="pr-24px">
              <NDatePicker
                v-model:formatted-value="dateRangeCreateTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
                @update:formatted-value="onDateRangeCreateTimeUpdate"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12" class="pr-24px">
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
