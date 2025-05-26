import type { TransformFnParams, TransformOptions } from 'class-transformer';
import { Transform } from 'class-transformer';

/**
 * 将query传入数组数为1的参数转换为数组
 *
 * @param {value} 传入的值
 * @param defaultValue 默认值
 * @returns
 */
export function parseArray({ value }: TransformFnParams, defaultValue?: unknown[]) {
  if (value !== undefined) {
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }
  return defaultValue;
}

export function ParseArray(defaultValue?: unknown[], options?: TransformOptions) {
  return Transform((params: TransformFnParams) => parseArray(params, defaultValue), options);
}
