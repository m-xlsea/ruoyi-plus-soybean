<script lang="tsx" setup>
import { reactive, ref, watch } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetCurrentTaskAllUser, fetchTaskOperate } from '@/service/api/workflow/task';
import { $t } from '@/locales';
import ButtonIcon from '@/components/custom/button-icon.vue';

defineOptions({
  name: 'ReduceSignatureDrawer'
});

interface Props {
  task: Api.Workflow.Task;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'reduceSubmit'): void;
}

const emit = defineEmits<Emits>();

const { loading, startLoading, endLoading } = useLoading();
type UserTaskModel = Api.System.User & { nodeName: string };

const userData = ref<UserTaskModel[]>([]);

type Model = Api.Workflow.TaskOperateParams;
const model: Model = reactive(createDefaultModel());

const checkedRowKeys = ref<CommonType.IdType[]>([]);

function createDefaultModel(): Model {
  return {
    taskId: null,
    userId: undefined,
    userIds: undefined,
    message: ''
  };
}
const columns = ref<NaiveUI.TableColumn<UserTaskModel>[]>([
  {
    type: 'selection',
    align: 'center',
    width: 50
  },
  {
    title: '节点名称',
    key: 'nodeName',
    align: 'center',
    minWidth: 120
  },
  {
    title: '办理人员',
    key: 'nickName',
    align: 'center',
    minWidth: 120
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 130,
    render(row) {
      return (
        <ButtonIcon
          text
          type="error"
          icon="material-symbols:delete-outline"
          tooltipContent={'减签'}
          popconfirmContent={'是否确认减签?'}
          onPositiveClick={() => handleReduceSignature([row.userId])}
        />
      );
    }
  }
]);

async function handleReduceSignature(userIds: CommonType.IdType[]) {
  model.taskId = props.task.id;
  model.userIds = userIds;
  const { error } = await fetchTaskOperate(model, 'reductionSignature');
  if (error) return;
  window.$message?.success('减签成功');
  handleCloseDrawer();
}

async function getTaskAllUser() {
  startLoading();
  const { error, data } = await fetchGetCurrentTaskAllUser(props.task.id);
  if (error) return;
  userData.value = data.map(item => ({
    ...item,
    nodeName: props.task.nodeName
  }));
  endLoading();
}

function handleCloseDrawer() {
  visible.value = false;
  emit('reduceSubmit');
}

watch(visible, async () => {
  if (visible.value) {
    await getTaskAllUser();
  }
});
</script>

<template>
  <NModal v-model:show="visible" class="w-700px" preset="card" title="待减签人员">
    <NCard class="h-full card-wrapper">
      <NSpace wrap justify="space-between" class="mb-16px lt-sm:w-200px">
        <TableRowCheckAlert v-model:checked-row-keys="checkedRowKeys" />
        <NButton
          size="small"
          ghost
          type="error"
          :disabled="checkedRowKeys.length === 0"
          @click="handleReduceSignature(checkedRowKeys)"
        >
          <template #icon>
            <icon-material-symbols:delete-outline class="text-icon" />
          </template>
          批量减签
        </NButton>
      </NSpace>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        class="h-400px"
        flex-height
        :row-key="row => row.userId"
        size="small"
        :columns="columns"
        :data="userData"
        :loading="loading"
      />
    </NCard>
  </NModal>
</template>

<style scoped lang="scss">
.n-alert {
  --n-padding: 5px 13px !important;
  --n-icon-margin: 6px 8px 0 12px !important;
  --n-icon-size: 20px !important;
}
</style>
