import type { HTMLAttributes } from 'vue';
import type { MaybePromise } from 'vee-validate';

export type RemoteCombobox<T extends SelectValue> = {
  remote?: true;
  // eslint-disable-next-line vue/no-unused-properties
  options: (value?: string) => Promise<SelectOption<T>[]>;
};

export type LocalCombobox<T extends SelectValue> = {
  remote?: false;
  // eslint-disable-next-line vue/no-unused-properties
  options: MaybePromise<SelectOption<T>[]>;
};

export interface BaseInputProps<T> {
  defaultValue?: T;
  modelValue?: T;
  class?: HTMLAttributes['class'];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export type SelectValue = string | number;

export type SelectOption<T extends SelectValue = SelectValue> = {
  label: string;
  value: T;
};
