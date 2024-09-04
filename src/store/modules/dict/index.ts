import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDictStore = defineStore('dict', () => {
  const dictData = ref<{ [key: string]: Array<Api.System.DictData> }>({});

  const getDict = (key: string) => {
    return dictData.value[key];
  };

  const setDict = (key: string, dict: Array<Api.System.DictData>) => {
    dictData.value[key] = dict;
  };

  const removeDict = (key: string) => {
    if (key in dictData.value) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete dictData.value[key];
    }
  };

  const cleanDict = () => {
    dictData.value = {};
  };

  return {
    dictData,
    getDict,
    setDict,
    removeDict,
    cleanDict
  };
});

export default useDictStore;
