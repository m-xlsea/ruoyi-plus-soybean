/**
 * 获取请求方法标签类型
 *
 * @param method 请求方法
 * @returns 标签类型
 */
export function getRequestMethodTagType(method: string): NaiveUI.ThemeColor {
  const methodUpper = method.toUpperCase();
  const colors: { [key: string]: NaiveUI.ThemeColor } = {
    DELETE: 'error',
    GET: 'success',
    POST: 'primary',
    PUT: 'warning'
  };

  return colors[methodUpper] ?? 'default';
}

const browserOptions = [
  { icon: 'logos:chrome', value: 'chrome' },
  { icon: 'logos:microsoft-edge', value: 'edge' },
  { icon: 'logos:firefox', value: 'firefox' },
  { icon: 'logos:opera', value: 'opera' },
  { icon: 'logos:safari', value: 'safari' },
  { icon: 'ic:baseline-wechat', value: 'micromessenger' },
  { icon: 'ic:baseline-wechat', value: 'windowswechat' },
  { icon: 'arcticons:quark-browser', value: 'quark' },
  { icon: 'ic:baseline-wechat', value: 'wxwork' },
  { icon: 'simple-icons:tencentqq', value: 'qq' },
  { icon: 'arcticons:dingtalk', value: 'dingtalk' },
  { icon: 'arcticons:uc-browser', value: 'uc' },
  { icon: 'ri:baidu-fill', value: 'baidu' }
];

const osOptions = [
  { icon: 'devicon:windows8', value: 'windows' },
  { icon: 'cbi:imac', value: 'osx' },
  { icon: 'devicon:linux', value: 'linux' },
  { icon: 'logos:android-icon', value: 'android' },
  { icon: 'file-icons:apple', value: 'ios' }
];
/**
 * 获取浏览器图标
 *
 * @param browser 浏览器
 * @returns 浏览器图标
 */
export function getBrowserIcon(browser: string): string {
  const icon = browserOptions.find(item => browser.toLocaleLowerCase().includes(item.value));
  return icon?.icon ?? 'stash:browser-light';
}

/**
 * 获取操作系统图标
 *
 * @param os 操作系统
 * @returns 操作系统图标
 */
export function getOsIcon(os: string): string {
  const icon = osOptions.find(item => os.toLocaleLowerCase().includes(item.value));
  return icon?.icon || 'mingcute:device-fill';
}
