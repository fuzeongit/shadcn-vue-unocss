import type { ColumnFilter } from '@tanstack/vue-table';

export class TanstackColumnFilterOption<T extends QuickFilter.ModelOption, VM extends object> implements ColumnFilter {
  constructor(
    public id: Global.StringKeys<VM>,
    public value: unknown,
    public option: T
  ) {}
}
