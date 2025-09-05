<script setup lang="tsx">
import { ref } from 'vue';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetFlowHisTaskList } from '@/service/api/workflow/instance';
import { fetchGetOssListByIds } from '@/service/api/system/oss';
import { useDict } from '@/hooks/business/dict';
import { useDownload } from '@/hooks/business/download';
import DictTag from '@/components/custom/dict-tag.vue';
import TagGroup from '@/components/custom/tag-group.vue';

defineOptions({
  name: 'ApprovalInfoPanel'
});
interface Props {
  /** 业务id */
  businessId: CommonType.IdType;
}
const props = defineProps<Props>();

useDict('wf_task_status');

const activeTab = ref('image');

const { loading, startLoading, endLoading } = useLoading();

const { oss } = useDownload();

const columns = ref<NaiveUI.TableColumn<Api.Workflow.HisTask>[]>([
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
      return <TagGroup value={row.approveName} />;
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
  activeTab.value = 'image';
  instanceId.value = undefined;
  hisTask.value = [];
  await getData();
}

async function getData() {
  startLoading();
  const { error, data } = await fetchGetFlowHisTaskList(props.businessId);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  instanceId.value = data?.instanceId || '';

  const rawList = data?.list || [];
  if (rawList.length === 0) {
    hisTask.value = [];
    return;
  }
  const promises = rawList.map(async (item: Api.Workflow.HisTask) => {
    if (item.ext) {
      const { error: err, data: ossList } = await fetchGetOssListByIds(item.ext.split(','));
      if (!err) {
        item.attachmentList = ossList;
      }
    }
  });
  await Promise.all(promises);
  hisTask.value = rawList;
  endLoading();
}

defineExpose({
  initData
});
</script>

<template>
  <NDivider />
  <div class="h-full">
    <NTabs v-model:value="activeTab" type="segment" animated>
      <NTabPane display-directive="show" bar-width="100px" name="image" tab="流程图">
        <FlowPreview v-if="instanceId" :instance-id="instanceId" />
      </NTabPane>
      <NTabPane bar-width="100px" name="info" tab="审批信息">
        <NDataTable size="small" :scroll-x="760" :columns="columns" :data="hisTask" :loading="loading" />
      </NTabPane>
    </NTabs>
  </div>
</template>
