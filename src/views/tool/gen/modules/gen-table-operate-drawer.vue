<script setup lang="tsx">
import { ref, watch } from 'vue';
import type { FormInst, SelectOption } from 'naive-ui';
import { NCheckbox, NInput, NSelect, NTabs } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
import {
  genHtmlTypeOptions,
  genJavaTypeOptions,
  genQueryTypeOptions,
  genTplCategoryOptions,
  genTypeOptions
} from '@/constants/business';
import { fetchGetDictTypeOption } from '@/service/api/system';
import { fetchGetGenTableInfo, fetchUpdateGenTable } from '@/service/api/tool';
import { useAppStore } from '@/store/modules/app';
import { useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'GenTableOperateDrawer'
});

interface Props {
  /** the edit row data */
  rowData?: Api.Tool.GenTable | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const appStore = useAppStore();
const { defaultRequiredRule } = useFormRules();
const { loading, startLoading, endLoading } = useLoading();
const genTableInfo = ref<Api.Tool.GenTableInfo>();

const tab = ref<'basic' | 'dragTable' | 'genInfo'>('dragTable');
const basicFormRef = ref<FormInst | null>(null);
type BasicRuleKey = Extract<keyof Api.Tool.GenTable, 'tableName' | 'tableComment' | 'className' | 'functionAuthor'>;

const basicRules: Record<BasicRuleKey, App.Global.FormRule> = {
  tableName: defaultRequiredRule,
  tableComment: defaultRequiredRule,
  className: defaultRequiredRule,
  functionAuthor: defaultRequiredRule
};

const infoFormRef = ref<FormInst | null>(null);
type InfoRuleKey = Extract<
  keyof Api.Tool.GenTable,
  | 'tplCategory'
  | 'packageName'
  | 'moduleName'
  | 'businessName'
  | 'functionName'
  | 'parentMenuId'
  | 'genType'
  | 'genPath'
  | 'treeCode'
  | 'treeParentCode'
  | 'treeName'
>;

const infoRules: Record<InfoRuleKey, App.Global.FormRule> = {
  tplCategory: defaultRequiredRule,
  packageName: defaultRequiredRule,
  moduleName: defaultRequiredRule,
  businessName: defaultRequiredRule,
  functionName: defaultRequiredRule,
  parentMenuId: defaultRequiredRule,
  genType: defaultRequiredRule,
  genPath: defaultRequiredRule,
  treeCode: defaultRequiredRule,
  treeParentCode: defaultRequiredRule,
  treeName: defaultRequiredRule
};

async function getGenTableInfo() {
  if (!props.rowData?.tableId) return;
  startLoading();
  // request
  const { error, data } = await fetchGetGenTableInfo(props.rowData.tableId);
  if (error) return;
  genTableInfo.value = data;
  endLoading();
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  try {
    await basicFormRef.value?.validate();
  } catch {
    tab.value = 'basic';
    window.$message?.error('表单校验未通过，请重新检查提交内容');
    return;
  }

  try {
    await infoFormRef.value?.validate();
  } catch {
    tab.value = 'genInfo';
    window.$message?.error('表单校验未通过，请重新检查提交内容');
    return;
  }

  const info = genTableInfo.value!.info;
  const genTable: Api.Tool.GenTable = jsonClone(info);
  genTable.params = {
    treeCode: info?.treeCode,
    treeName: info?.treeName,
    treeParentCode: info?.treeParentCode,
    parentMenuId: info?.parentMenuId
  };
  genTable.columns = genTableInfo.value?.rows;

  // request
  const { error } = await fetchUpdateGenTable(genTable);
  if (error) return;
  window.$message?.success('修改成功');

  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    genTableInfo.value = undefined;
    tab.value = 'dragTable';
    getDictOptions();
    getGenTableInfo();
  }
});

const dictOptions = ref<SelectOption[]>([]);
const { loading: dictLoading, startLoading: startDictLoading, endLoading: endDictLoading } = useLoading();

async function getDictOptions() {
  startDictLoading();
  const { error, data } = await fetchGetDictTypeOption();
  if (error) return;
  dictOptions.value = data.map(dict => ({
    value: dict.dictType!,
    class: 'gen-dict-select',
    label: dict.dictName
  }));
  endDictLoading();
}

const columns: NaiveUI.TableColumn<Api.Tool.GenTableColumn>[] = [
  {
    key: 'sort',
    title: $t('common.index'),
    align: 'center',
    width: 80
  },
  {
    key: 'columnName',
    title: '字段列名',
    align: 'left',
    minWidth: 120
  },
  {
    key: 'columnComment',
    title: '字段描述',
    align: 'left',
    minWidth: 120,
    render: row => <NInput v-model:value={row.columnComment} placeholder="请输入字段描述" />
  },
  {
    key: 'columnType',
    title: '物理类型',
    align: 'left',
    width: 120
  },
  {
    key: 'javaType',
    title: 'Java 类型',
    align: 'left',
    width: 136,
    render: row => <NSelect v-model:value={row.javaType} placeholder="请选择 Java 类型" options={genJavaTypeOptions} />
  },
  {
    key: 'javaField',
    title: 'Java 属性',
    align: 'left',
    minWidth: 120,
    render: row => <NInput v-model:value={row.javaField} placeholder="请输入 Java 属性" />
  },
  {
    key: 'isInsert',
    title: '插入',
    align: 'center',
    width: 64,
    render: row => <NCheckbox checked-value="1" unchecked-value="0" v-model:checked={row.isInsert} />
  },
  {
    key: 'isEdit',
    title: '编辑',
    align: 'center',
    width: 64,
    render: row => <NCheckbox checked-value="1" unchecked-value="0" v-model:checked={row.isEdit} />
  },
  {
    key: 'isList',
    title: '列表',
    align: 'center',
    width: 64,
    render: row => <NCheckbox checked-value="1" unchecked-value="0" v-model:checked={row.isList} />
  },
  {
    key: 'isQuery',
    title: '查询',
    align: 'center',
    width: 64,
    render: row => <NCheckbox checked-value="1" unchecked-value="0" v-model:checked={row.isQuery} />
  },
  {
    key: 'queryType',
    title: '查询方式',
    align: 'left',
    width: 130,
    render: row => <NSelect v-model:value={row.queryType} placeholder="请选择查询方式" options={genQueryTypeOptions} />
  },
  {
    key: 'isRequired',
    title: '必填',
    align: 'center',
    width: 64,
    render: row => <NCheckbox checked-value="1" unchecked-value="0" v-model:checked={row.isRequired} />
  },
  {
    key: 'htmlType',
    title: '显示类型',
    align: 'left',
    width: 130,
    render: row => <NSelect v-model:value={row.htmlType} placeholder="请选择显示类型" options={genHtmlTypeOptions} />
  },
  {
    key: 'dictType',
    title: '字典类型',
    align: 'left',
    width: 150,
    render: row => {
      if (row.dictType === '') {
        row.dictType = undefined;
      }

      const renderLabel = (option: CommonType.Option) => (
        <div class="w-full flex justify-between gap-12px">
          <span>{option.label}</span>
          <span class="flex-1 text-end text-13px text-#8492a6">{option.value}</span>
        </div>
      );

      const renderTag = ({ option }: { option: CommonType.Option }) => <>{option.label}</>;

      return (
        <NSelect
          v-model:value={row.dictType}
          loading={dictLoading.value}
          options={dictOptions.value}
          clear-filter-after-select={false}
          consistent-menu-width={false}
          render-label={renderLabel}
          render-tag={renderTag}
          clearable
        />
      );
    }
  }
];
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="100%">
    <NDrawerContent title="编辑表" :native-scrollbar="false" closable>
      <NSpin :show="loading" class="h-full" content-class="h-full">
        <NTabs v-model:value="tab" type="segment" animated class="h-full" pane-class="h-full">
          <NTabPane name="basic" tab="基本信息" display-directive="show">
            <NForm
              v-if="genTableInfo?.info"
              ref="basicFormRef"
              class="mx-auto max-w-800px"
              :model="genTableInfo.info"
              :rules="basicRules"
            >
              <NGrid :x-gap="16" responsive="screen" item-responsive>
                <NFormItemGi span="24 s:12" label="表名称" path="tableName">
                  <NInput v-model:value="genTableInfo.info.tableName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="表描述" path="tableComment">
                  <NInput v-model:value="genTableInfo.info.tableComment" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="实体类名称" path="className">
                  <NInput v-model:value="genTableInfo.info.className" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="作者" path="functionAuthor">
                  <NInput v-model:value="genTableInfo.info.functionAuthor" />
                </NFormItemGi>
                <NFormItemGi span="24" label="备注" path="remark">
                  <NInput v-model:value="genTableInfo.info.remark" type="textarea" />
                </NFormItemGi>
              </NGrid>
            </NForm>
          </NTabPane>
          <NTabPane name="dragTable" tab="字段信息" display-directive="show">
            <div class="h-full flex-col">
              <NDataTable
                :columns="columns"
                :data="genTableInfo?.rows"
                size="small"
                :flex-height="!appStore.isMobile"
                :scroll-x="1800"
                remote
                class="flex-1"
              />
            </div>
          </NTabPane>
          <NTabPane name="genInfo" tab="生成信息" display-directive="show">
            <NForm
              v-if="genTableInfo?.info"
              ref="infoFormRef"
              class="mx-auto max-w-800px"
              :model="genTableInfo.info"
              :rules="infoRules"
            >
              <NGrid :x-gap="16" responsive="screen" item-responsive>
                <NFormItemGi span="24 s:12" label="生成模板" path="tplCategory">
                  <NSelect
                    v-model:value="genTableInfo.info.tplCategory"
                    :options="genTplCategoryOptions"
                    placeholder="请选择生成模板"
                  />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" path="packageName">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="生成在哪个java包下，例如 com.ruoyi.system" />
                      <span class="pl-3px">生成包路径</span>
                    </div>
                  </template>
                  <NInput v-model:value="genTableInfo.info.packageName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" path="moduleName">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="可理解为子系统名，例如 system，flow-instance。避免驼峰命名" />
                      <span class="pl-3px">生成模块名</span>
                    </div>
                  </template>
                  <NInput v-model:value="genTableInfo.info.moduleName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="生成业务名" path="businessName">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="可理解为功能英文名，例如 user" />
                      <span class="pl-3px">生成业务名</span>
                    </div>
                  </template>
                  <NInput v-model:value="genTableInfo.info.businessName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="生成功能名" path="functionName">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="用作类描述，例如 用户" />
                      <span class="pl-3px">生成功能名</span>
                    </div>
                  </template>
                  <NInput v-model:value="genTableInfo.info.functionName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="上级菜单" path="parentMenuId">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="分配到指定菜单下，例如 系统管理" />
                      <span class="pl-3px">上级菜单</span>
                    </div>
                  </template>
                  <MenuTreeSelect v-model:value="genTableInfo.info.parentMenuId" :data-name="rowData?.dataName" />
                </NFormItemGi>
                <NFormItemGi span="24 s:12" label="生成代码方式" path="genType">
                  <template #label>
                    <div class="flex-center">
                      <FormTip content="默认为zip压缩包下载，也可以自定义生成路径" />
                      <span class="pl-3px">生成代码方式</span>
                    </div>
                  </template>
                  <NRadioGroup v-model:value="genTableInfo.info.genType">
                    <NSpace :span="16">
                      <NRadio
                        v-for="option in genTypeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </NSpace>
                  </NRadioGroup>
                </NFormItemGi>
                <NFormItemGi v-if="genTableInfo.info.genType === '1'" span="24 s:12" label="自定义路径" path="genPath">
                  <NInput v-model:value="genTableInfo.info.genPath" />
                </NFormItemGi>
              </NGrid>

              <template v-if="genTableInfo.info.tplCategory === 'tree'">
                <NDivider>其他信息</NDivider>

                <NGrid :x-gap="16" responsive="screen" item-responsive>
                  <NFormItemGi span="24 s:12" path="treeCode">
                    <template #label>
                      <div class="flex-center">
                        <FormTip content="树显示的编码字段名， 如：dept_id" />
                        <span>树编码字段</span>
                      </div>
                    </template>
                    <NSelect
                      v-model:value="genTableInfo.info.treeCode"
                      placeholder="请选择树编码字段"
                      :options="
                        genTableInfo.rows.map(column => ({
                          value: column.columnName,
                          label: column.columnName + '：' + column.columnComment
                        }))
                      "
                    />
                  </NFormItemGi>
                  <NFormItemGi span="24 s:12" path="treeParentCode">
                    <template #label>
                      <div class="flex-center">
                        <FormTip content="树显示的父编码字段名， 如：parent_Id" />
                        <span>树父编码字段</span>
                      </div>
                    </template>
                    <NSelect
                      v-model:value="genTableInfo.info.treeParentCode"
                      placeholder="请选择树父编码字段"
                      :options="
                        genTableInfo.rows.map(column => ({
                          value: column.columnName,
                          label: column.columnName + '：' + column.columnComment
                        }))
                      "
                    />
                  </NFormItemGi>
                  <NFormItemGi span="24 s:12" path="treeName">
                    <template #label>
                      <div class="flex-center">
                        <FormTip content="树节点的显示名称字段名， 如：dept_name" />
                        <span>树名称字段</span>
                      </div>
                    </template>
                    <NSelect
                      v-model:value="genTableInfo.info.treeName"
                      placeholder="请选择树名称字段"
                      :options="
                        genTableInfo.rows.map(column => ({
                          value: column.columnName,
                          label: column.columnName + '：' + column.columnComment
                        }))
                      "
                    />
                  </NFormItemGi>
                </NGrid>
              </template>
            </NForm>
          </NTabPane>
        </NTabs>
      </NSpin>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton :disabled="loading" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped lang="scss">
:deep(.n-drawer-body-content-wrapper) {
  height: 100%;
}

:deep(.n-tabs-pane-wrapper) {
  height: 100%;
}
</style>

<style>
.gen-dict-select {
  width: 100%;

  .n-base-select-option__content {
    width: 100%;
  }
}
</style>
