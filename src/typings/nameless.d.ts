declare namespace Nameless {
  type MaybePromise<T> = import('src/components/nameless/common/type').MaybePromise<T>;
  namespace Form {
    type SelectValue = import('src/components/nameless/form/type').SelectValue;

    type SelectOption<T extends SelectValue = SelectValue> =
      import('src/components/nameless/form/type').SelectOption<T>;
  }
}
