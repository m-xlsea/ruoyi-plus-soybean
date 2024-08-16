// @unocss-include
import { getRgb } from '@sa/color';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import SystemLogo from '@/assets/imgs/logo.png';

export function setupLoading() {
  const themeColor = localStg.get('themeColor') || '#2080f0';

  const { r, g, b } = getRgb(themeColor);

  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  const loading = `
<div class="fixed-center flex-col" style="${primaryColor}">
  <div class="w-120px h-120px my-36px">
    <div class="relative h-full animate-spin">
      <img src="${SystemLogo}" width="120" />
    </div>
  </div>
  <h2 class="text-28px font-500 text-#646464">${$t('system.title')}</h2>
</div>`;

  const app = document.getElementById('app');

  if (app) {
    app.innerHTML = loading;
  }
}
