<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'OperLogSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const dateRangeOperTime = ref<[string, string] | null>(null);

const model = defineModel<Api.Monitor.OperLogSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

function onDateRangeOperTimeUpdate(value: [string, string] | null) {
  if (value?.length) {
    model.value.params!.beginTime = value[0];
    model.value.params!.endTime = value[1];
  }
}

function resetModel() {
  dateRangeOperTime.value = null;
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
            <NFormItemGi span="24 s:12 m:6" label="系统模块" path="title" class="pr-24px">
              <NInput v-model:value="model.title" placeholder="请输入系统模块" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="操作类型" path="businessType" class="pr-24px">
              <DictSelect
                v-model:value="model.businessType"
                placeholder="请选择操作类型"
                dict-code="sys_oper_type"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="操作人员" path="operName" class="pr-24px">
              <NInput v-model:value="model.operName" placeholder="请输入操作人员" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="操作IP" path="operIp" class="pr-24px">
              <NInput v-model:value="model.operIp" placeholder="请输入操作IP" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="操作状态" path="status" class="pr-24px">
              <DictSelect
                v-model:value="model.status"
                placeholder="请选择操作状态"
                dict-code="sys_common_status"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="操作时间" path="operTime" class="pr-24px">
              <NDatePicker
                v-model:formatted-value="dateRangeOperTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
                @update:formatted-value="onDateRangeOperTimeUpdate"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" class="pr-24px">
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
