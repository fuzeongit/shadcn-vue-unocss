import dayjs from 'dayjs';
import { unionBy } from 'lodash-es';
import { DateFormatter } from '@internationalized/date';
import { useI18nInject } from '../common/i18n.inject';
import type { LocalCombobox, RemoteCombobox, SelectOption, SelectValue } from './type';

export const dictionaryToOption = <T extends SelectValue = SelectValue>(
  dictionary: any,
  valueToNumber: boolean = false
): SelectOption<T>[] => {
  return Object.keys(dictionary).map(key => ({
    value: (valueToNumber ? Number(key) : key) as T,
    label: dictionary[key]
  }));
};

export const extractOption = (value: SelectValue | undefined | null, options: SelectOption[]) => {
  if (value === undefined || value === null) {
    return '';
  }
  return options.find(item => item.value === value)?.label ?? '';
};

// helper to pull hours/minutes/seconds from timestamp
export const extractDatetime = (ts: number | undefined, end: boolean = false) => {
  if (!ts) return { hours: end ? 23 : 0, minutes: end ? 59 : 0, seconds: end ? 59 : 0 };
  const d = dayjs(ts);
  return { hours: d.hour(), minutes: d.minute(), seconds: d.second() };
};

export const useCacheOptions = <T extends SelectValue>({
  remote,
  options: maybeOptionsFn
}: RemoteCombobox<T> | LocalCombobox<T>) => {
  const searchValue = ref<string>();

  /** 缓存的选项，包括已经搜索过的 */
  const cacheOptions: Ref<SelectOption<T>[]> = ref([]);

  /** 当不是远程搜索时，这样有两种可能，传入的是function，则获取，如果是数组则赋值 */
  const localOptions = asyncComputed(async () => {
    if (!remote) {
      return typeof maybeOptionsFn === 'function' ? await maybeOptionsFn() : maybeOptionsFn;
    }
    return [];
  }, []);

  /** 当前搜索出来的选项 */
  const currentOptions = asyncComputed(() => {
    return remote
      ? maybeOptionsFn(searchValue.value)
      : localOptions.value.filter(it =>
          searchValue.value === undefined ? true : it.label.includes(searchValue.value)
        );
  }, []);

  watch(
    currentOptions,
    () => {
      cacheOptions.value = unionBy(cacheOptions.value, currentOptions.value, 'value');
    },
    { immediate: true }
  );

  return {
    searchValue,
    cacheOptions,
    localOptions,
    currentOptions
  };
};

export const useDateFormatter = (dateTimeFormatOptions: Intl.DateTimeFormatOptions) => {
  const i18nInject = useI18nInject();

  const locale = computed(() => i18nInject.locale?.value ?? navigator.language);

  const dateFormatter = computed(() => new DateFormatter(locale?.value, dateTimeFormatOptions));

  return { dateFormatter, locale };
};
