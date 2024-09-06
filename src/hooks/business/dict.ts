import { ref } from 'vue';
import { fetchGetDictDataByType } from '@/service/api';
import { useDictStore } from '@/store/modules/dict';

export function useDict(dictType: string, immediate: boolean = true) {
  const dictStore = useDictStore();

  const data = ref<Api.System.DictData[]>([]);
  const record = ref<Record<string, string>>({});
  const options = ref<CommonType.Option[]>([]);

  async function getData() {
    const dicts = dictStore.getDict(dictType);
    if (dicts) {
      data.value = dicts;
      return;
    }
    const { data: dictData, error } = await fetchGetDictDataByType(dictType);
    if (error) return;
    dictStore.setDict(dictType, dictData);
    data.value = dictData;
  }

  async function getRecord() {
    if (!data.value.length) {
      await getData();
    }
    data.value.forEach(dict => {
      record.value[dict.dictValue!] = dict.dictLabel!;
    });
  }

  async function getOptions() {
    if (!data.value.length) {
      await getData();
    }

    options.value = data.value.map(dict => ({ label: dict.dictLabel!, value: dict.dictValue! }));
  }

  if (immediate) {
    getData().then(() => {
      getRecord();
      getOptions();
    });
  }

  return {
    data,
    record,
    options,
    getData,
    getRecord,
    getOptions
  };
}
