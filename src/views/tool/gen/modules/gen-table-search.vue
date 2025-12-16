<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'GenTableSearch'
});

interface Props {
  options: CommonType.Option[];
}

defineProps<Props>();

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.Tool.GenTableSearchParams>('model', { required: true });

const dateRange = ref<[string, string]>();

function onDateRangeUpdate(value: [string, string] | null) {
  if (value?.length) {
    model.value.params!.beginTime = value[0];
    model.value.params!.endTime = value[1];
  }
}

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  model.value.params!.beginTime = null;
  model.value.params!.endTime = null;
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
            <NFormItemGi span="24 s:12 m:6" label="数据源" label-width="auto" path="dataName" class="pr-24px">
              <NSelect v-model:value="model.dataName" :options="options" placeholder="请选择数据源" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="表名称" label-width="auto" path="tableName" class="pr-24px">
              <NInput v-model:value="model.tableName" placeholder="请输入表名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="表描述" label-width="auto" path="tableComment" class="pr-24px">
              <NInput v-model:value="model.tableComment" placeholder="请输入表描述" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="创建时间" label-width="auto" class="pr-24px">
              <NDatePicker
                v-model:formatted-value="dateRange"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                clearable
                @update:formatted-value="onDateRangeUpdate"
              />
            </NFormItemGi>
            <NFormItemGi :show-feedback="false" span="24" class="pb-6px pr-24px">
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
