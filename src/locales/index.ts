import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import { getLocale } from '@/utils/i18n';

const i18n = createI18n({
  fallbackLocale: getLocale(),
  legacy: false,
  globalInjection: true
});

/**
 * Setup plugin i18n
 *
 * @param app
 */
export function setupI18n(app: App) {
  app.use(i18n);
}

export const $t = i18n.global.t as App.I18n.$T;

export const t = i18n.global.t as App.I18n.$T;

export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
}

export async function loadLanguageAsync() {
  const locale = localStg.get('lang') || 'zh-CN';
  const localeFile = await import(`@/locales/langs/${locale.toLowerCase()}.json`);
  const namelessFile = await import(`@/components/nameless/locales/langs/${locale.toLowerCase()}.json`);
  // 动态加载对应的语言包
  i18n.global.setLocaleMessage(locale, localeFile.default);
  i18n.global.mergeLocaleMessage(locale, namelessFile.default);
  return setLocale(locale);
}
