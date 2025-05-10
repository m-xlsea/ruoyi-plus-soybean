// @unocss-include
import { getRgb } from '@sa/color';
import { DARK_CLASS } from '@/constants/app';
import { localStg } from '@/utils/storage';
import { toggleHtmlClass } from '@/utils/common';
import systemLogo from '@/assets/imgs/logo.png';
import { $t } from '@/locales';

export function setupLoading() {
  const app = document.getElementById('app');

  const themeColor = localStg.get('themeColor') || '#2080f0';
  const darkMode = localStg.get('darkMode') || false;
  const { r, g, b } = getRgb(themeColor);

  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  if (darkMode) {
    toggleHtmlClass(DARK_CLASS).add();
  }

  const loading = `
<div class="fixed-center flex-col bg-layout" style="${primaryColor}">
<div class="w-120px h-120px my-36px">
    <div class="relative h-full animate-spin">
      <img src="${systemLogo}" width="120" />
    </div>
  </div>
  <h2 class="text-28px font-500 text-primary">${$t('system.title')}</h2>
</div>`;

  if (app) {
    app.innerHTML = loading;
  }
}
