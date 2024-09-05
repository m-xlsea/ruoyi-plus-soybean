import { ref } from 'vue';
import { useLoading } from '@sa/hooks';

/** Content Loading */
export default function useContentLoading() {
  const description = ref<string>('loading...');
  const loading = useLoading();

  function startLoading(desc: string = 'loading...') {
    description.value = desc;
    loading.startLoading();
  }

  function endLoading() {
    description.value = 'loading...';
    loading.endLoading();
  }

  return {
    loading: loading.loading,
    description,
    startLoading,
    endLoading
  };
}
