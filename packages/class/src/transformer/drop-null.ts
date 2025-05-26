import type { TransformFnParams, TransformOptions } from 'class-transformer';
import { Transform } from 'class-transformer';

/**
 * 将null转换为undefined
 *
 * @param {value} 传入的值
 * @returns
 */
export function dropNull({ value }: TransformFnParams) {
  return value ?? undefined;
}

export function DropNull(options?: TransformOptions) {
  return Transform(dropNull, options);
}
