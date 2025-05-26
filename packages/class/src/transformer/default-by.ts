import type { TransformFnParams, TransformOptions } from 'class-transformer';
import { Transform } from 'class-transformer';

export function defaultBy({ value }: TransformFnParams, validate: (value?: any) => boolean, defaultValue: unknown) {
  if (validate(value)) {
    return value;
  }
  return defaultValue;
}

export function DefaultBy(validate: (value?: any) => boolean, defaultValue: unknown, options?: TransformOptions) {
  return Transform((params: TransformFnParams) => defaultBy(params, validate, defaultValue), options);
}
