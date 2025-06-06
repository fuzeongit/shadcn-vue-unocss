import type { I18nInject } from './type';

export const I18N_INJECTION_KEY = Symbol('i18n');

export function useI18nInject() {
  const i18n = inject(I18N_INJECTION_KEY) as I18nInject | undefined;
  return {
    locale: i18n?.locale
  };
}
