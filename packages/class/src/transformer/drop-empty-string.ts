import type { TransformFnParams, TransformOptions } from 'class-transformer';
import { Transform } from 'class-transformer';

/**
 * 将null转换为undefined
 *
 * @param {value} 传入的值
 * @returns
 */
export function dropEmptyString({ value }: TransformFnParams) {
  return value === '' ? undefined : value;
}

export function DropEmptyString(options?: TransformOptions) {
  return Transform(dropEmptyString, options);
}
