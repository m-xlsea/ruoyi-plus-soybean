import { fetchGetDictDataByType } from '@/service/api';
import { useDictStore } from '@/store/modules/dict';

export function useDict() {
  const dictStore = useDictStore();

  async function getDictData(...args: string[]) {
    const dictData: { [key: string]: Api.System.DictData[] } = {};
    const promises = args.map(async dictType => {
      dictData[dictType] = [];
      const dicts = dictStore.getDict(dictType);
      if (dicts) {
        dictData[dictType] = dicts;
        return;
      }
      const { data, error } = await fetchGetDictDataByType(dictType);
      if (error) return;
      dictData[dictType] = data;
      dictStore.setDict(dictType, data);
    });
    await Promise.all(promises);
    return dictData;
  }

  async function getDictRecord(...args: string[]) {
    const dictRecord: { [key: string]: { [key: string]: string } } = {};
    const dictData = await getDictData(...args);
    Object.keys(dictData).forEach(dictType => {
      const data: { [key: string]: string } = {};
      Object.keys(dictData);
      dictData[dictType].forEach(dict => {
        data[dict.dictValue!] = dict.dictLabel!;
      });
      dictRecord[dictType] = data;
    });
    return dictRecord;
  }

  async function getDictOptions(...args: string[]) {
    const dictOptions: { [key: string]: CommonType.Option[] } = {};
    const dictData = await getDictData(...args);
    Object.keys(dictData).forEach(dictType => {
      dictOptions[dictType] = dictData[dictType].map(dict => ({ label: dict.dictLabel!, value: dict.dictValue! }));
    });
    return dictOptions;
  }

  async function transformDictByCode(type: string, code: string) {
    const dictData = await getDictData(type);
    return transformDictByOptions(code, dictData[type]);
  }

  function transformDictByOptions(code: string, options: Api.System.DictData[]) {
    return options.find(item => item.dictValue === code)?.dictLabel;
  }

  return {
    getDictData,
    getDictRecord,
    getDictOptions,
    transformDictByCode,
    transformDictByOptions
  };
}
