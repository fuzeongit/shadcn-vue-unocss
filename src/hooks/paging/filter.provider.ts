import { cloneDeep, get, keyBy, mapValues } from 'lodash-es';
import type { ColumnFilter } from '@tanstack/vue-table';
import type { FormContext } from 'vee-validate';
import { useForm } from 'vee-validate';
import { FilterType } from '@/hooks/filter/constants';
import type { TanstackColumnFilterOption } from '@/hooks/filter/models';
import type { OrderFilter } from '../order';

export const filterProvideKey = Symbol('filter');

export type FilterInject<T extends QuickFilter.ModelOption, VM extends OrderFilter> = {
  valuesBuilder: () => VM;
  columnFilters: ComputedRef<ColumnFilter[]>;
  search: () => void;
  reset: () => void;
  filterOptions: TanstackColumnFilterOption<T, VM>[];
  form: FormContext<VM, VM>;
  keepValues: Ref<VM>;
};

export function useFilterProvider<VM extends object>(
  options: TanstackColumnFilterOption<QuickFilter.ModelOption, VM>[],
  search: (v: ColumnFilter[]) => void
) {
  const valuesBuilder = () =>
    mapValues(keyBy(options, 'id'), o => (typeof o.value === 'object' ? cloneDeep(o.value) : o.value) as any) as VM;

  const form = useForm<VM>({ initialValues: valuesBuilder() as any });

  const columnFilters = computed(() => {
    return options
      .map(item => {
        const value = get(form.values, item.id);
        const term = [
          item.option.type === FilterType.String && value,
          item.option.type === FilterType.Number && value !== undefined && value !== null,
          item.option.type === FilterType.Select && value !== undefined && value !== null,
          item.option.type === FilterType.RemoteSelect && value !== undefined && value !== null,
          item.option.type === FilterType.MultiSelect,
          item.option.type === FilterType.RemoteMultiSelect,
          item.option.type === FilterType.Date && value !== undefined && value !== null,
          item.option.type === FilterType.DateRange
        ];

        if (term.some(it => it)) {
          return {
            id: item.id,
            value: get(form.values, item.id)
          } as ColumnFilter;
        }
        return undefined;
      })
      .filter(it => it !== undefined);
  });

  const keepValues = ref<VM>(valuesBuilder());

  const localSearch = () => {
    keepValues.value = cloneDeep(form.values);
    search(columnFilters.value);
  };

  const reset = () => {
    form.resetForm();
    localSearch();
  };

  provide(filterProvideKey, {
    form,
    valuesBuilder,
    columnFilters,
    search: localSearch,
    reset,
    filterOptions: options,
    keepValues
  });
}

export function useFilterInject<T extends QuickFilter.ModelOption, VM extends OrderFilter>(): FilterInject<T, VM> {
  return inject(filterProvideKey) as FilterInject<T, VM>;
}
