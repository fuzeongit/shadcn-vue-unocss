declare namespace QuickFilter {
  type TanstackColumnFilter = import('@tanstack/vue-table').ColumnFilter;

  type LocalCombobox = import('src/components/nameless/form').LocalCombobox<TNameless.Form.SelectValue>;
  type RemoteCombobox = import('src/components/nameless/form').RemoteCombobox<Nameless.Form.SelectValue>;
  // interface SelectOption {
  //   label: string;
  //   value?: null | string | number | boolean;
  // }

  interface Option {
    placeholder?: string;
    clearable?: boolean;
    class?: import('vue').HTMLAttributes['class'];
  }

  interface StringOption extends Option {
    type: import('./constants').FilterType.String;
  }

  interface NumberOption extends Option {
    type: import('./constants').FilterType.Number;
    min?: number;
    max?: number;
    step?: number;
  }

  type SelectOption = Option &
    (LocalCombobox | RemoteCombobox) & {
      type: import('./constants').FilterType.Select;
    };

  type MultiSelectOption = Option &
    (LocalCombobox | RemoteCombobox) & {
      type: import('./constants').FilterType.MultiSelect;
    };

  interface DateOption extends Option {
    type: import('./constants').FilterType.Date;
  }

  interface DatetimeOption extends Option {
    type: import('./constants').FilterType.Datetime;
  }

  interface DateRangeOption extends Option {
    type: import('./constants').FilterType.DateRange;
  }

  interface DatetimeRangeOption extends Option {
    type: import('./constants').FilterType.DatetimeRange;
  }

  interface AutoCompleteOption extends Option {
    type: import('./constants').FilterType.AutoComplete;
    loading: boolean;
    action: (value: string) => void;
  }

  interface TanstackColumnFilterExtend<T extends ModelOption> extends TanstackColumnFilter {
    option: T;
  }

  type ModelOption =
    | StringOption
    | NumberOption
    | SelectOption
    | MultiSelectOption
    | DateOption
    | DatetimeOption
    | DateRangeOption
    | DatetimeRangeOption
    | AutoCompleteOption;

  type Model<T> = {
    [key in keyof T]?: ModelOption;
  };
}
