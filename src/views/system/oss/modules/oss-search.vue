<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'OssSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const dateRangeCreateTime = ref<[string, string] | null>(null);

const model = defineModel<Api.System.OssSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

function onDateRangeCreateTimeUpdate(value: [string, string] | null) {
  const params = model.value.params!;
  if (value && value.length === 2) {
    [params.beginTime, params.endTime] = value;
  } else {
    params.beginTime = undefined;
    params.endTime = undefined;
  }
}

function resetModel() {
  dateRangeCreateTime.value = null;
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
        <NForm :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="文件名" path="fileName" class="pr-24px">
              <NInput v-model:value="model.fileName" placeholder="请输入文件名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="原名" path="originalName" class="pr-24px">
              <NInput v-model:value="model.originalName" placeholder="请输入原名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="文件后缀名" path="fileSuffix" class="pr-24px">
              <NInput v-model:value="model.fileSuffix" placeholder="请输入文件后缀名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="服务商" path="service" class="pr-24px">
              <NInput v-model:value="model.service" placeholder="请输入服务商" />
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
