import type { Ref } from 'vue';
import useBoolean from './use-boolean';

export interface LoadingApiInst {
  loading: Ref<boolean>;
  startLoading: () => void;
  endLoading: () => void;
}

/**
 * Loading
 *
 * @param initValue Init value
 */
export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading
  };
}
