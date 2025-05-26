declare namespace Imanum {
  type MaybePromise<T> = (() => Promise<T>) | T;
  namespace Form {
    type SelectValue = string | number;
    type SelectOption<T extends SelectValue = SelectValue> = {
      label: string;
      value: T;
    };
  }
}
