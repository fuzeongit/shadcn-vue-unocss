import { Default, DropEmptyString, DropNull, IsValidDate, ParseArray } from '@nameless/class';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SelectOptions } from '@/constants/dictionary/select-options';
import { Pageable } from '@/hooks/paging/models';

export class Params extends Pageable {
  @Type(() => String)
  @DropNull()
  @DropEmptyString()
  @IsString()
  @IsOptional()
  @Expose()
  @Default('default')
  str?: string;

  @Type(() => Number)
  @DropNull()
  @IsNumber()
  @IsOptional()
  @Expose()
  num?: number;

  @Type(() => String)
  @DropNull()
  @IsEnum(Object.keys(SelectOptions))
  @IsOptional()
  @Expose()
  sel?: keyof typeof SelectOptions;

  @Type(() => String)
  @DropNull()
  @ParseArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  mulSel!: (keyof typeof SelectOptions)[];

  @Type(() => String)
  @DropNull()
  @IsString()
  @IsOptional()
  @Expose()
  remSel?: keyof typeof SelectOptions;

  @Type(() => String)
  @DropNull()
  @ParseArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  remMulSel!: (keyof typeof SelectOptions)[];

  @Type(() => Number)
  @DropNull()
  @IsValidDate()
  @IsNumber()
  @IsOptional()
  @Expose()
  date?: number;

  @Type(() => Number)
  @DropNull()
  @IsValidDate({ each: true })
  @IsNumber({}, { each: true })
  @IsOptional()
  @Expose()
  dateRange?: number[];

  // @Expose({ name: 'startDate', toPlainOnly: true })
  // @Exclude({ toClassOnly: true })
  // get startDate() {
  //   return this.dateRange[0]?.toString();
  // }

  // @Expose({ name: 'endDate', toPlainOnly: true })
  // @Exclude({ toClassOnly: true })
  // get endDate() {
  //   return this.dateRange[0]?.toString();
  // }
}
