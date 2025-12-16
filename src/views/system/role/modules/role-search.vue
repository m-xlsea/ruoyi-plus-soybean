<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { useNaiveForm } from '@/hooks/common/form';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { validate, restoreValidation } = useNaiveForm();

const dateRangeCreateTime = ref<[string, string] | null>(null);

const model = defineModel<Api.System.RoleSearchParams>('model', { required: true });

const defaultModel = jsonClone(toRaw(model.value));

const { options: sysNormalDisableOptions } = useDict('sys_normal_disable', false);

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
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="角色名称" path="roleName" class="pr-24px">
              <NInput v-model:value="model.roleName" placeholder="请输入角色名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="权限字符" path="roleKey" class="pr-24px">
              <NInput v-model:value="model.roleKey" placeholder="请输入权限字符" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="角色状态" path="status" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                placeholder="请选择角色状态"
                :options="sysNormalDisableOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="创建时间" path="createTime" class="pr-24px">
              <NDatePicker
                v-model:formatted-value="dateRangeCreateTime"
                update-value-on-close
                class="w-full"
                type="daterange"
                value-format="yyyy-MM-dd"
                clearable
                @update:formatted-value="onDateRangeCreateTimeUpdate"
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
