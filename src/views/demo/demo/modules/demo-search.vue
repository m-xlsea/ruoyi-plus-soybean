<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'DemoSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.Demo.DemoSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
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
      <NCollapseItem :title="$t('common.search')" name="demo-demo-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="部门 ID" label-width="auto" path="deptId" class="pr-24px">
              <DeptTreeSelect v-model:value="model.deptId" placeholder="请选择部门" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="用户 ID" label-width="auto" path="userId" class="pr-24px">
              <UserSelect v-model:value="model.userId" placeholder="请选择用户" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="Key 键" label-width="auto" path="testKey" class="pr-24px">
              <NInput v-model:value="model.testKey" placeholder="请输入Key 键" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="值" label-width="auto" path="value" class="pr-24px">
              <NInput v-model:value="model.value" placeholder="请输入值" />
            </NFormItemGi>
            <NFormItemGi :show-feedback="false" span="24" class="pr-24px">
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
