<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NTag } from 'naive-ui';
import { fetchGetFlowHisTaskList } from '@/service/api/workflow/instance';
import { useDict } from '@/hooks/business/dict';
import DictTag from '@/components/custom/dict-tag.vue';

interface Props {
  /** 业务id */
  businessId: CommonType.IdType;
}
useDict('wf_task_status');
const props = defineProps<Props>();

const activeTab = ref('info');

const columns = ref<DataTableColumns<Api.Workflow.HisTask>>([
  {
    title: '任务名称',
    key: 'nodeName',
    align: 'center',
    width: 100
  },
  {
    title: '办理人',
    key: 'approveName',
    align: 'center',
    width: 100,
    render: row => {
      return (
        <NTag size="small" type="info">
          {row.approveName}
        </NTag>
      );
    }
  },
  {
    title: '任务状态',
    key: 'flowStatus',
    align: 'center',
    width: 100,
    render: row => {
      return <DictTag size="small" value={row.flowStatus} dict-code="wf_task_status" />;
    }
  },
  {
    title: '审批意见',
    key: 'message',
    align: 'center',
    width: 100
  },
  {
    title: '开始时间',
    key: 'createTime',
    align: 'center',
    width: 100
  },
  {
    title: '结束时间',
    key: 'updateTime',
    align: 'center',
    width: 100
  },
  {
    title: '运行时间',
    key: 'runDuration',
    align: 'center',
    width: 100
  },
  {
    title: '附件',
    key: 'attachmentList',
    align: 'center',
    width: 100
  }
]);

const instanceId = ref<CommonType.IdType>();

const HisTask = ref<Api.Workflow.HisTask[]>([]);

async function getData() {
  const { error, data } = await fetchGetFlowHisTaskList(props.businessId);
  if (error) {
    window.$message?.error(error.message);
  }
  instanceId.value = data?.instanceId || '';
  HisTask.value = data?.list || [];
}

onMounted(() => {
  getData();
});
</script>

<template>
  <NDivider />
  <div>
    <NTabs v-model:value="activeTab" type="segment" animated>
      <NTabPane bar-width="100px" name="info" tab="审批信息">
        <NDataTable class="max-h-500px" :columns="columns" :data="HisTask" />
      </NTabPane>
      <NTabPane bar-width="100px" name="image" tab="流程图">
        “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的 Amazon 服务，还是救公寓的火。
        <br />
        <br />
        我的脑海中忽然出现了 Amazon
        著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
        debug 这个线上问题。
      </NTabPane>
    </NTabs>
  </div>
</template>
