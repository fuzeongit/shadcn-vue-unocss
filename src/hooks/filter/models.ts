import type { ColumnFilter } from '@tanstack/vue-table';
import type { Path } from 'vee-validate';

export class TanstackColumnFilterOption<T extends QuickFilter.ModelOption, VM extends object> implements ColumnFilter {
  constructor(
    public id: Path<VM>,
    public value: unknown,
    public option: T
  ) {}
}
