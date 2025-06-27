<script setup lang="ts">
import { stringify } from 'qs';
import { getToken } from '@/store/modules/auth/shared';
import { getServiceBaseURL } from '@/utils/service';

defineOptions({
  name: 'FlowPreview'
});
interface Props {
  instanceId: CommonType.IdType;
}
const props = defineProps<Props>();

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const urlParams = {
  type: 'FlowChart',
  id: props.instanceId,
  Authorization: `Bearer ${getToken()}`,
  clientid: import.meta.env.VITE_APP_CLIENT_ID || ''
};

const iframeUrl = `${baseURL}/warm-flow-ui/index.html?${stringify(urlParams)}`;
</script>

<template>
  <div>
    <iframe :src="iframeUrl" class="h-[600px] w-full" />
  </div>
</template>
