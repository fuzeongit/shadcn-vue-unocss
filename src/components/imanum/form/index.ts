export const dictionaryToOption = <T extends Imanum.Form.SelectValue = Imanum.Form.SelectValue>(
  dictionary: any,
  valueToNumber: boolean = false
): Imanum.Form.SelectOption<T>[] => {
  return Object.keys(dictionary).map(key => ({
    value: (valueToNumber ? Number(key) : key) as T,
    label: dictionary[key]
  }));
};

export const extractOption = (
  value: Imanum.Form.SelectValue | undefined | null,
  options: Imanum.Form.SelectOption[]
) => {
  if (value === undefined || value === null) {
    return '';
  }
  return options.find(item => item.value === value)?.label ?? '';
};
