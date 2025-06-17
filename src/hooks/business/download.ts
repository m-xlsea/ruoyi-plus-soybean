import { errorCodeRecord } from '@/constants/common';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { transformToURLSearchParams } from '@/utils/common';

export function useDownload() {
  const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
  const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

  function downloadByData(data: BlobPart, filename: string, type: string = 'application/octet-stream') {
    const blobData = [data];
    const blob = new Blob(blobData, { type });

    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }

  function download(url: string, params: Record<string, any>, fileName: string) {
    window.$loading?.startLoading('正在下载数据，请稍候...');
    const token = localStg.get('token');
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const now = Date.now();
    const searchParams = transformToURLSearchParams(params);

    fetch(`${baseURL}${url}?t=${now}`, {
      method: 'post',
      body: searchParams,
      headers: {
        Authorization: `Bearer ${token}`,
        Clientid: clientId!,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(async response => {
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const res = await response.json();
          const code = res.code as CommonType.ErrorCode;
          throw new Error(errorCodeRecord[code] || res.msg || errorCodeRecord.default);
        }
        return response.blob();
      })
      .then(data => downloadByData(data, fileName, 'application/zip'))
      .catch(err => window.$message?.error(err.message))
      .finally(() => window.$loading?.endLoading());
  }

  function oss(ossId: CommonType.IdType) {
    window.$loading?.startLoading('正在下载数据，请稍候...');
    const token = localStg.get('token');
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const url = `/resource/oss/download/${ossId}`;
    const now = Date.now();
    let fileName = String(`${ossId}-${now}`);
    fetch(`${baseURL}${url}?t=${now}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        Clientid: clientId!,
        'Content-Type': 'application/octet-stream'
      }
    })
      .then(async response => {
        fileName = String(response.headers.get('Download-Filename'));
        return response.blob();
      })
      .then(data => downloadByData(data, fileName))
      .catch(err => window.$message?.error(err.message))
      .finally(() => window.$loading?.endLoading());
  }

  function zip(url: string, fileName: string) {
    window.$loading?.startLoading('正在下载数据，请稍候...');
    const token = localStg.get('token');
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const now = Date.now();
    fetch(`${baseURL}${url}${url.includes('?') ? '&' : '?'}t=${now}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        Clientid: clientId!,
        'Content-Type': 'application/octet-stream'
      }
    })
      .then(async response => {
        if (response.headers.get('Content-Type')?.includes('application/json')) {
          const res = await response.json();
          const code = res.code as CommonType.ErrorCode;
          throw new Error(errorCodeRecord[code] || res.msg || errorCodeRecord.default);
        }
        return response.blob();
      })
      .then(data => downloadByData(data, fileName, 'application/zip'))
      .catch(err => window.$message?.error(err.message))
      .finally(() => window.$loading?.endLoading());
  }

  return {
    oss,
    zip,
    download
  };
}
