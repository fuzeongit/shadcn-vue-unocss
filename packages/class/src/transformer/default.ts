import type { TransformFnParams, TransformOptions } from 'class-transformer';
import { Transform } from 'class-transformer';

export function defaultFn({ value }: TransformFnParams, defaultValue: unknown) {
  return value ?? defaultValue;
}

export function Default(defaultValue: unknown, options?: TransformOptions) {
  return Transform((params: TransformFnParams) => defaultFn(params, defaultValue), options);
}
