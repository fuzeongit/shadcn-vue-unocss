import { localStg } from './storage';

export const getLocale = () => {
  const locale = localStg.get('lang') ?? navigator.language;
  if (locale === 'zh-CN') {
    return 'zh-CN';
  } else if (locale === 'zh-HK' || locale === 'zh-TW' || locale === 'zh') {
    return 'zh-HK';
  } else if (locale === 'vi-VN') {
    return 'vi-VN';
  }
  return 'en-US';
};
