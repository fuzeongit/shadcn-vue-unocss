declare namespace Nameless {
  type MaybePromise<T> = (() => Promise<T>) | T;
  namespace Form {
    type SelectValue = string | number;

    type SelectOption<T extends SelectValue = SelectValue> = {
      label: string;
      value: T;
    };

    type RemoteCombobox<T extends SelectValue> = {
      remote?: true;
      options: (value?: string) => Promise<Nameless.Form.SelectOption<T>[]>;
    };

    type LocalCombobox<T extends SelectValue> = {
      remote?: false;
      options: Nameless.MaybePromise<Nameless.Form.SelectOption<T>[]>;
    };
  }
}
