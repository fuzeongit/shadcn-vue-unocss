import { Default } from '@zeongit/class';
import type { IPageable } from 'vue-router-search';
import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { OrderFilter } from '../order';
import { DEFAULT_COMPONENT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from './constants';

export class Pageable extends OrderFilter implements IPageable {
  @Type(() => Number)
  @Default(DEFAULT_COMPONENT_PAGE_NUMBER)
  @IsInt()
  @Expose({ name: 'pageNumber', toClassOnly: true })
  pageNumber: number;

  @Type(() => Number)
  @Default(DEFAULT_PAGE_SIZE)
  @IsInt()
  @Expose({ name: 'pageSize', toClassOnly: true })
  pageSize: number;

  constructor(pageable?: Partial<Pageable>) {
    super(pageable);
    this.pageNumber = pageable?.pageNumber ?? DEFAULT_COMPONENT_PAGE_NUMBER;
    this.pageSize = pageable?.pageSize ?? DEFAULT_PAGE_SIZE;
  }
}
