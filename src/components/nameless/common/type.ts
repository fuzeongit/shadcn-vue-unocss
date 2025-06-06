export type MaybePromise<T> = (() => Promise<T>) | T;

export interface I18nInject {
  locale: Ref<string>;
}
