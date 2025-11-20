<script setup lang="tsx">
import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';
import { getRequestMethodTagType } from '@/utils/icon-tag-format';
import { $t } from '@/locales';
import DictTag from '@/components/custom/dict-tag.vue';

defineOptions({
  name: 'OperLogViewDrawer'
});

interface Props {
  /** the edit row data */
  rowData: Api.Monitor.OperLog | null;
}

const props = defineProps<Props>();
const visible = defineModel<boolean>('visible', {
  default: false
});

const title = '操作日志详情';

function closeDrawer() {
  visible.value = false;
}
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="800" class="max-w-90%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NDescriptions label-class="min-w-100px" :column="1" size="small" bordered label-placement="left">
        <NDescriptionsItem label="日志编号">{{ props.rowData?.operId }}</NDescriptionsItem>
        <NDescriptionsItem label="操作状态">
          <DictTag size="small" :value="props.rowData?.status" dict-code="sys_common_status" />
        </NDescriptionsItem>
        <NDescriptionsItem label="系统模块">
          <NSpace>
            <NTag class="m-1" size="small" type="primary">{{ props.rowData?.title }}模块</NTag>
            <DictTag size="small" :value="props.rowData?.businessType" dict-code="sys_oper_type" />
          </NSpace>
        </NDescriptionsItem>
        <NDescriptionsItem label="操作信息">
          {{ props.rowData?.operName }} | {{ props.rowData?.deptName }} | {{ props.rowData?.operIp }} |
          {{ props.rowData?.operLocation }}
        </NDescriptionsItem>
        <NDescriptionsItem label="请求信息">
          <NSpace>
            <NTag size="small" :type="getRequestMethodTagType(props.rowData?.requestMethod ?? '')">
              {{ `${props.rowData?.requestMethod?.toUpperCase()}请求` }}
            </NTag>
            {{ props.rowData?.operUrl }}
          </NSpace>
        </NDescriptionsItem>
        <NDescriptionsItem label="操作时间">{{ props.rowData?.operTime }}</NDescriptionsItem>
        <NDescriptionsItem label="请求参数">
          <JsonPreview :code="props.rowData?.operParam" />
        </NDescriptionsItem>
        <NDescriptionsItem label="返回参数">
          <JsonPreview :code="props.rowData?.jsonResult" />
        </NDescriptionsItem>
        <NDescriptionsItem label="消耗时间">
          {{ `${props.rowData?.costTime} ms` }}
        </NDescriptionsItem>
        <NDescriptionsItem label="错误消息">{{ props.rowData?.errorMsg }}</NDescriptionsItem>
      </NDescriptions>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.close') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
