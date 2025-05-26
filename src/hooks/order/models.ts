import { ParseArray } from '@zeongit/class';
import type { IOrderFilter } from 'vue-router-search';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import type { Order } from './enum';
export const OrderDelimiter = '.';

export class OrderFilter implements IOrderFilter {
  @Type(() => String)
  @ParseArray([])
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  sort: `${string}${typeof OrderDelimiter}${Order}`[];

  constructor(query?: Partial<OrderFilter>) {
    this.sort = query?.sort ?? [];
  }
}

export class Sort {
  key: string;
  order: Order;

  constructor(sort: `${string}${typeof OrderDelimiter}${Order}`) {
    const [key, order] = sort.split(OrderDelimiter) as [string, Order];
    this.key = key;
    this.order = order;
  }

  toString() {
    return `${this.key}${OrderDelimiter}${this.order}`;
  }
}
