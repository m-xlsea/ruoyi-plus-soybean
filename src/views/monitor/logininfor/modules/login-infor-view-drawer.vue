<script setup lang="ts">
import { getBrowserIcon, getOsIcon } from '@/utils/icon-tag-format';
import { $t } from '@/locales';

defineOptions({
  name: 'LoginInforViewDrawer'
});

interface Props {
  /** the edit row data */
  rowData: Api.Monitor.LoginInfor | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = '登录信息详情';

function closeDrawer() {
  visible.value = false;
}
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NDescriptions label-placement="left" :column="1" size="small" bordered>
        <NDescriptionsItem label="账号信息">
          {{ props.rowData?.userName }} | {{ props.rowData?.ipaddr }} | {{ props.rowData?.loginLocation }}
        </NDescriptionsItem>
        <NDescriptionsItem label="客户端">
          {{ props.rowData?.clientKey }}
        </NDescriptionsItem>
        <NDescriptionsItem label="设备类型">
          <DictTag size="small" :value="props.rowData?.deviceType" dict-code="sys_device_type" />
        </NDescriptionsItem>
        <NDescriptionsItem label="浏览器类型">
          <div class="flex items-center gap-2">
            <SvgIcon :icon="getBrowserIcon(props.rowData?.browser ?? '')" />
            {{ props.rowData?.browser }}
          </div>
        </NDescriptionsItem>
        <NDescriptionsItem label="操作系统">
          <div class="flex items-center gap-2">
            <SvgIcon :icon="getOsIcon(props.rowData?.os ?? '')" />
            {{ props.rowData?.os }}
          </div>
        </NDescriptionsItem>
        <NDescriptionsItem label="登录状态">
          <DictTag size="small" :value="props.rowData?.status" dict-code="sys_common_status" />
        </NDescriptionsItem>
        <NDescriptionsItem label="提示消息">
          {{ props.rowData?.msg }}
        </NDescriptionsItem>
        <NDescriptionsItem label="访问时间">
          {{ props.rowData?.loginTime }}
        </NDescriptionsItem>
      </NDescriptions>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
