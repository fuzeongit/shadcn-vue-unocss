import dayjs from 'dayjs';

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
