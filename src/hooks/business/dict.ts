import { ref } from 'vue';
import { fetchGetDictDataByType } from '@/service/api';
import { useDictStore } from '@/store/modules/dict';

export function useDict() {
  const dictStore = useDictStore();

  async function getDictData(dictType: string) {
    const dicts = dictStore.getDict(dictType);
    if (dicts) {
      return dicts;
    }
    const { data, error } = await fetchGetDictDataByType(dictType);
    if (error) return [];
    dictStore.setDict(dictType, data);
    return data;
  }

  function getDictRecord(dictType: string) {
    const dictRecord = ref<{ [key: string]: string }>({});
    getDictData(dictType).then(dictData => {
      dictData.forEach(dict => {
        dictRecord.value[dict.dictValue!] = dict.dictLabel!;
      });
    });
    return dictRecord;
  }

  function getDictOptions(dictType: string) {
    const dictOptions = ref<CommonType.Option[]>([]);
    getDictData(dictType).then(dictData => {
      dictOptions.value = dictData.map(dict => ({ label: dict.dictLabel!, value: dict.dictValue! }));
    });
    return dictOptions;
  }

  return {
    getDictData,
    getDictRecord,
    getDictOptions
  };
}
