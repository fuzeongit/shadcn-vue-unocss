declare namespace QuickFilter {
  type TanstackColumnFilter = import('@tanstack/vue-table').ColumnFilter;
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

  interface SelectOption extends Option {
    type: import('./constants').FilterType.Select;
    options: ((value?: string) => Promise<Imanum.Form.SelectOption<T>[]>) | Imanum.Form.SelectOption<T>[];
    valueType?: 'string' | 'number';
    immediate?: boolean;
  }

  interface RemoteSelectOption extends Option {
    type: import('./constants').FilterType.RemoteSelect;
    options: ((value?: string) => Promise<Imanum.Form.SelectOption<T>[]>) | Imanum.Form.SelectOption<T>[];
    valueType?: 'string' | 'number';
    searchTerm?: string;
    immediate?: boolean;
  }

  interface MultiSelectOption extends Option {
    type: import('./constants').FilterType.MultiSelect;
    options: Imanum.MaybePromise<Imanum.Form.SelectOption<Imanum.Form.SelectValue>[]>;
    valueType?: 'string' | 'number';
    searchTerm?: string;
    immediate?: boolean;
  }

  interface RemoteMultiSelectOption extends Option {
    type: import('./constants').FilterType.RemoteMultiSelect;
    options: (value?: string) => Promise<Imanum.Form.SelectOption<Imanum.Form.SelectValue>[]>;
    valueType?: 'string' | 'number';
    immediate?: boolean;
  }

  interface DateRangeOption extends Option {
    type: import('./constants').FilterType.DateRange;
    startPlaceholder?: string;
    endPlaceholder?: string;
  }

  interface DateOption extends Option {
    type: import('./constants').FilterType.Date;
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
    | RemoteSelectOption
    | MultiSelectOption
    | RemoteMultiSelectOption
    | DateRangeOption
    | DateOption
    | AutoCompleteOption;

  type Model<T> = {
    [key in keyof T]?: ModelOption;
  };
}
