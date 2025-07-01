// @unocss-include
import { getRgb } from '@sa/color';
import { DARK_CLASS } from '@/constants/app';
import { localStg } from '@/utils/storage';
import { toggleHtmlClass } from '@/utils/common';
import { $t } from '@/locales';
import '@/styles/scss/loading.scss';

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
  <div class="my-52px h-120px w-120px">
    <!-- From Uiverse.io by SchawnnahJ -->
    <div class="loader"></div>
  </div>
  <h2 class="text-30px text-primary-400 font-500">${$t('system.title')}</h2>
</div>`;

  if (app) {
    app.innerHTML = loading;
  }
}
