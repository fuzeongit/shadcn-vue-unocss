import type { HTMLAttributes } from 'vue';
import dayjs from 'dayjs';
import { unionBy } from 'lodash-es';
import { DateFormatter } from '@internationalized/date';
import { useI18nInject } from '../common/i18n.inject';

export type RemoteCombobox<T extends Nameless.Form.SelectValue> = {
  remote?: true;
  // eslint-disable-next-line vue/no-unused-properties
  options: (value?: string) => Promise<Nameless.Form.SelectOption<T>[]>;
};

export type LocalCombobox<T extends Nameless.Form.SelectValue> = {
  remote?: false;
  // eslint-disable-next-line vue/no-unused-properties
  options: Nameless.MaybePromise<Nameless.Form.SelectOption<T>[]>;
};

export interface BaseInputProps<T> {
  defaultValue?: T;
  modelValue?: T;
  class?: HTMLAttributes['class'];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export const dictionaryToOption = <T extends Nameless.Form.SelectValue = Nameless.Form.SelectValue>(
  dictionary: any,
  valueToNumber: boolean = false
): Nameless.Form.SelectOption<T>[] => {
  return Object.keys(dictionary).map(key => ({
    value: (valueToNumber ? Number(key) : key) as T,
    label: dictionary[key]
  }));
};

export const extractOption = (
  value: Nameless.Form.SelectValue | undefined | null,
  options: Nameless.Form.SelectOption[]
) => {
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

export const useCacheOptions = <T extends Nameless.Form.SelectValue>({
  remote,
  options: maybeOptionsFn
}: Nameless.Form.RemoteCombobox<T> | Nameless.Form.LocalCombobox<T>) => {
  const searchValue = ref<string>();

  /** 缓存的选项，包括已经搜索过的 */
  const cacheOptions: Ref<Nameless.Form.SelectOption<T>[]> = ref([]);

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
