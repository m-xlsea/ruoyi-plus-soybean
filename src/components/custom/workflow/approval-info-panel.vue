<script setup lang="tsx">
import { ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetFlowHisTaskList } from '@/service/api/workflow/instance';
import { fetchGetOssListByIds } from '@/service/api/system/oss';
import { useDict } from '@/hooks/business/dict';
import { useDownload } from '@/hooks/business/download';
import DictTag from '@/components/custom/dict-tag.vue';

defineOptions({
  name: 'ApprovalInfoPanel'
});
interface Props {
  /** 业务id */
  businessId: CommonType.IdType;
}
const props = defineProps<Props>();

useDict('wf_task_status');

const activeTab = ref('info');

const { loading, startLoading, endLoading } = useLoading();

const { oss } = useDownload();

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
      if (!row.approveName) return null;

      const approveNames = row.approveName.split(',');

      if (approveNames.length <= 1) {
        return (
          <NTag size="small" type="info">
            {row.approveName}
          </NTag>
        );
      }
      return (
        <NPopover trigger="hover" placement="bottom">
          {{
            trigger: () => (
              <NTag size="small" type="info" class="cursor-pointer">
                {approveNames[0]}...({approveNames.length})
              </NTag>
            ),
            default: () => (
              <NSpace vertical size="small">
                {approveNames.map(name => (
                  <NTag key={name} size="small" type="info">
                    {name}
                  </NTag>
                ))}
              </NSpace>
            )
          }}
        </NPopover>
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
    width: 120
  },
  {
    title: '结束时间',
    key: 'updateTime',
    align: 'center',
    width: 120
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
    width: 120,
    render: row => {
      if (!row.attachmentList || row.attachmentList.length === 0) return null;

      if (row.attachmentList.length === 1) {
        return (
          <NTag size="small" type="info" class="cursor-pointer">
            <div class="flex items-center gap-2" onClick={() => oss(row.attachmentList[0].ossId)}>
              {row.attachmentList[0].originalName}
            </div>
          </NTag>
        );
      }

      return (
        <NPopover trigger="hover" placement="bottom">
          {{
            trigger: () => (
              <NTag size="small" type="info" class="cursor-pointer">
                {row.attachmentList[0].originalName}...({row.attachmentList.length})
              </NTag>
            ),
            default: () => (
              <NSpace vertical size="small">
                {row.attachmentList.map(item => (
                  <NTag key={item.ossId} size="small" type="info" class="cursor-pointer">
                    <div class="flex items-center gap-2" onClick={() => oss(item.ossId)}>
                      {item.originalName}
                    </div>
                  </NTag>
                ))}
              </NSpace>
            )
          }}
        </NPopover>
      );
    }
  }
]);

const instanceId = ref<CommonType.IdType>();

const hisTask = ref<Api.Workflow.HisTask[]>([]);

/** 初始化数据 */
async function initData() {
  hisTask.value = [];
  if (loading.value) return;
  startLoading();
  try {
    await getData();
  } finally {
    endLoading();
  }
}

async function getData() {
  const { error, data } = await fetchGetFlowHisTaskList(props.businessId);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  instanceId.value = data?.instanceId || '';
  hisTask.value = data?.list || [];

  // 并行加载所有附件数据
  const promises = hisTask.value.map(async item => {
    if (item.ext) {
      const { error: err, data: ossList } = await fetchGetOssListByIds(item.ext.split(','));
      if (!err) {
        item.attachmentList = ossList;
      }
    }
  });

  await Promise.all(promises);
}

defineExpose({
  initData
});
</script>

<template>
  <NDivider />
  <div>
    <NTabs v-model:value="activeTab" type="segment" animated>
      <NTabPane bar-width="100px" name="info" tab="审批信息">
        <NDataTable
          size="small"
          :scroll-x="760"
          class="max-h-500px"
          :columns="columns"
          :data="hisTask"
          :loading="loading"
        />
      </NTabPane>
      <NTabPane bar-width="100px" name="image" tab="流程图">
        "威尔！着火了！快来帮忙！"我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的 Amazon 服务，还是救公寓的火。
        <br />
        <br />
        我的脑海中忽然出现了 Amazon
        著名的领导力准则"客户至上"，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
        debug 这个线上问题。
      </NTabPane>
    </NTabs>
  </div>
</template>
