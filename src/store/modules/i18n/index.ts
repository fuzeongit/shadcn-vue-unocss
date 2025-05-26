import { defineStore } from 'pinia';
import { SetupStoreId } from '@/constants/enum/system';
import { getLocale } from '@/utils/i18n';
import { localStg } from '@/utils/storage';

export const useI18nStore = defineStore(SetupStoreId.I18n, {
  state: () => ({
    language: getLocale()
  }),
  actions: {
    changeLanguage(language: App.I18n.LangType) {
      // window.$i18n!.locale.value = language;
      // this.$state.language = language;
      localStg.set('lang', language);
      window.location.reload();
    }
  }
});
