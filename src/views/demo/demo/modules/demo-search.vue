<script setup lang="ts">
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'DemoSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.Demo.DemoSearchParams>('model', { required: true });

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
            <NFormItemGi span="24 s:12 m:6" label="部门" path="deptId" class="pr-24px">
              <DeptTreeSelect v-model:value="model.deptId" placeholder="请选择部门" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="用户" path="userId" class="pr-24px">
              <UserSelect v-model:value="model.userId" placeholder="请选择用户" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="key 键" path="testKey" class="pr-24px">
              <NInput v-model:value="model.testKey" placeholder="请输入 key 键" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="值" path="value" class="pr-24px">
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
