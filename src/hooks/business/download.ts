import StreamSaver from 'streamsaver';
import { errorCodeRecord } from '@/constants/common';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { transformToURLSearchParams } from '@/utils/common';

interface RequestConfig {
  method: 'GET' | 'POST';
  url: string;
  params?: Record<string, any>;
  filename?: string;
  contentType?: string;
}

export function useDownload() {
  const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
  const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

  const isHttps = () => {
    const protocol = document.location.protocol;
    const hostname = document.location.hostname;
    return protocol === 'https' || hostname === 'localhost' || hostname === '127.0.0.1';
  };

  /** 获取通用请求头 */
  const getCommonHeaders = (contentType = 'application/octet-stream') => ({
    Authorization: `Bearer ${localStg.get('token')}`,
    Clientid: import.meta.env.VITE_APP_CLIENT_ID!,
    'Content-Type': contentType
  });

  /** 通用下载方法 */
  function downloadByData(data: BlobPart, filename: string, type = 'application/octet-stream') {
    const blob = new Blob([data], { type });
    const blobURL = window.URL.createObjectURL(blob);

    const tempLink = Object.assign(document.createElement('a'), {
      style: { display: 'none' },
      href: blobURL,
      download: filename
    });

    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }

  /** 流式下载 */
  async function downloadByStream(
    readableStream: ReadableStream<Uint8Array>,
    filename: string,
    contentLength?: number
  ): Promise<void> {
    window.$loading?.endLoading();
    StreamSaver.mitm = '/streamsaver/mitm.html?version=2.0.0';
    const fileStream = StreamSaver.createWriteStream(filename, { size: contentLength });

    if (window.WritableStream && readableStream?.pipeTo) {
      await readableStream.pipeTo(fileStream);
      window.$message?.success('下载完成');
      return;
    }

    // 降级处理
    const writer = fileStream.getWriter();
    const reader = readableStream.getReader();

    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) return writer.close();
      await writer.write(value);
      return pump();
    };

    await pump();
  }

  /** 处理响应 */
  async function handleResponse(response: Response) {
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const res = await response.json();
      const code = res.code as CommonType.ErrorCode;
      throw new Error(errorCodeRecord[code] || res.msg || errorCodeRecord.default);
    }
  }

  /** 核心下载逻辑 */
  async function executeDownload(config: RequestConfig): Promise<void> {
    const { method, url, params, filename, contentType } = config;
    const timestamp = Date.now();
    const fullUrl = `${baseURL}${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;

    window.$loading?.startLoading('正在下载数据，请稍候...');

    try {
      const requestOptions: RequestInit = {
        method,
        headers: getCommonHeaders(contentType)
      };

      if (method === 'POST' && params) {
        requestOptions.body = transformToURLSearchParams(params);
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        };
      }

      const response = await fetch(fullUrl, requestOptions);

      if (response.status !== 200) {
        throw new Error(errorCodeRecord.default);
      }

      await handleResponse(response);

      const rawHeader = response.headers.get('Download-Filename');
      const finalFilename = filename || (rawHeader ? decodeURIComponent(rawHeader) : null) || `download-${timestamp}`;

      if (response.body && isHttps()) {
        const contentLength = Number(response.headers.get('Content-Length'));
        await downloadByStream(response.body, finalFilename, contentLength);
        return;
      }

      const responseContentType = response.headers.get('Content-Type');
      const mainType = responseContentType?.split(';')[0]?.trim() || 'application/octet-stream';
      downloadByData(await response.blob(), finalFilename, mainType);
    } catch (error: any) {
      window.$message?.error(error.message);
    } finally {
      window.$loading?.endLoading();
    }
  }

  /** 公共下载接口 */
  const download = (url: string, params: Record<string, any>, filename: string) =>
    executeDownload({ method: 'POST', url, params, filename });

  /** OSS文件下载 */
  const oss = (ossId: CommonType.IdType) =>
    executeDownload({
      method: 'GET',
      url: `/resource/oss/download/${ossId}`
    });

  /** ZIP文件下载 */
  const zip = (url: string, filename: string) =>
    executeDownload({
      method: 'GET',
      url,
      filename,
      contentType: 'application/octet-stream'
    });

  return {
    oss,
    zip,
    download
  };
}
