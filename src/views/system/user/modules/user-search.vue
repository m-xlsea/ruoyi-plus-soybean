<script setup lang="ts">
import { ref } from 'vue';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const dateRangeCreateTime = ref<[string, string]>();

const model = defineModel<Api.System.UserSearchParams>('model', { required: true });

async function reset() {
  dateRangeCreateTime.value = undefined;
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  if (dateRangeCreateTime.value?.length) {
    model.value.params!.beginCreateTime = dateRangeCreateTime.value[0];
    model.value.params!.endCreateTime = dateRangeCreateTime.value[0];
  }
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="table-search card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="用户名称" path="userName" class="pr-24px">
              <NInput v-model:value="model.userName" placeholder="请输入用户名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="用户昵称" path="nickName" class="pr-24px">
              <NInput v-model:value="model.nickName" placeholder="请输入用户昵称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="手机号码" path="phonenumber" class="pr-24px">
              <NInput v-model:value="model.phonenumber" placeholder="请输入手机号码" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="帐号状态" path="status" class="pr-24px">
              <DictSelect
                v-model:value="model.status"
                placeholder="请选择帐号状态"
                dict-code="sys_normal_disable"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="创建时间" path="createTime" class="pr-24px">
              <NDatePicker
                v-model:formatted-value="dateRangeCreateTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:16" class="pr-24px">
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
