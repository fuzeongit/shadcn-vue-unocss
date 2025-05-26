import type { LocationQuery } from 'vue-router';
import { keyBy, map, mapValues, omit } from 'lodash-es';
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Updater
} from '@tanstack/vue-table';
import { getCoreRowModel, getExpandedRowModel, useVueTable } from '@tanstack/vue-table';
import type { ClassConstructor, ClassTransformOptions } from 'class-transformer';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { type ValidatorOptions, validate } from 'class-validator';
import type { IOrderFilter } from 'vue-router-search';
import { useListing, usePaging, useSingle } from 'vue-router-search';
import { useFilterModel } from '../filter';
import { OrderDelimiter, type OrderFilter } from '../order';
import { getFilterButton } from '../filter/components';
import { DEFAULT_COMPONENT_PAGE_NUMBER } from './constants';
import type { Pageable } from './models';

declare const brand: unique symbol;

export type PlainOf<T> = Record<string, any> & { [brand]: T };

type DefaultBuilderOptions<VM extends object, Plain> = {
  fetchParamsBuilder?: (normParams: VM, options?: ClassTransformOptions) => Plain;
  paramsBuilder?: (searchParams?: LocationQuery, options?: ClassTransformOptions) => VM;
  validateParams?: (searchParams: VM, validatorOptions?: ValidatorOptions) => Promise<void>;
  errorBuilder?: (result: unknown) => void;
  cls: ClassConstructor<VM>;
};

interface NaiveOptions<VM extends object, Plain, T> extends DefaultBuilderOptions<VM, Plain> {
  fetchBuilder: (params: Plain) => Promise<Service.RestfulResult<T>>;
  filterModelBuilder?: () => QuickFilter.Model<VM>;
  watchRoute?: boolean;
  immediate?: boolean;
  after?: (data: T) => void;
}

type SingleOptions<VM extends object, Plain, T> = NaiveOptions<VM, Plain, T>;

interface ListingOptions<VM extends OrderFilter, Plain, T> extends NaiveOptions<VM, Plain, T[]> {
  multipleOrder?: boolean;
  columns: ColumnDef<T, any>[];
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  columnPinningState?: Ref<ColumnPinningState>;
}

interface PageOptions<VM extends Pageable, Plain, T> extends NaiveOptions<VM, Plain, Service.Pagination<T>> {
  multipleOrder?: boolean;
  columns: ColumnDef<T, any>[];
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  columnPinningState?: Ref<ColumnPinningState>;
}

type TableOptions<T, VM extends IOrderFilter> = {
  columns: ColumnDef<T, any>[];
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  columnPinningState?: Ref<ColumnPinningState>;
  columnFiltersState?: Ref<ColumnFiltersState>;
  sortingState?: Ref<SortingState>;
  paginationState?: Ref<PaginationState>;
  search: (params?: Partial<VM>) => Promise<void>;
  changeSort: (sort: string[]) => Promise<void>;
  changePage?: (pageNumber: number) => Promise<void>;
  changeLimit?: (pageSize: number) => Promise<void>;
};

function toTanstackPagination<VM extends Pageable>(vm: VM): PaginationState {
  return {
    pageIndex: vm.pageNumber,
    pageSize: vm.pageSize
  };
}

function toTanstackColumnFilters<VM extends object>(vm: VM): ColumnFiltersState {
  const params = omit(vm, ['pageNumber', 'pageSize', 'sort']);
  return map(params, (value, id) => ({ id, value }));
}

function toTanstackSorting<VM extends OrderFilter>(vm: VM): SortingState {
  const { sort } = vm;
  return sort.map(it => it.split(OrderDelimiter)).map(([id, order]) => ({ id, desc: order === 'DESC' }));
}

function valueUpdater<Value extends Updater<any>>(updaterOrValue: Value, ref: Ref) {
  return typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
}

export function useDefaultBuilder<VM extends object, Plain>({
  cls,
  fetchParamsBuilder,
  paramsBuilder,
  validateParams,
  errorBuilder
}: DefaultBuilderOptions<VM, Plain>) {
  return {
    fetchParamsBuilder(normParams: VM, options?: ClassTransformOptions) {
      if (fetchParamsBuilder) {
        return fetchParamsBuilder(normParams, options);
      }
      return instanceToPlain(normParams, options) as Plain;
    },
    paramsBuilder(sp?: LocationQuery, options?: ClassTransformOptions) {
      if (paramsBuilder) {
        return paramsBuilder(sp ?? {}, options);
      }
      return plainToInstance(cls, sp, options);
    },
    async validateParams(params: VM, validatorOptions: ValidatorOptions = { strictGroups: true }) {
      if (validateParams) {
        return validateParams(params, validatorOptions);
      }
      const errors = await validate(toRaw(params), validatorOptions);
      if (errors.length) {
        const error = Object.values(errors[0]!.constraints as object).shift();
        // window.$message?.warning(error);
        return Promise.reject(error);
      }
      return Promise.resolve();
    },
    errorBuilder(result: unknown) {
      if (errorBuilder) {
        errorBuilder(result);
      }
      // throw new Error(result.message ?? '请求失败');
    }
  };
}

export function useTanstackTable<T, VM extends IOrderFilter>({
  columnPinningState,
  columnFiltersState,
  sortingState,
  paginationState,
  search,
  columns,
  getRowId,
  changeSort,
  changeLimit,
  changePage
}: TableOptions<T, VM>) {
  const data: Ref<T[]> = ref([]);
  const rowSelectionState = ref<RowSelectionState>({});

  const table = useVueTable({
    data,
    columns,
    getRowId,
    enableColumnResizing: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    // onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    onRowSelectionChange: updaterOrValue => {
      rowSelectionState.value = valueUpdater(updaterOrValue, rowSelectionState);
    },
    onColumnFiltersChange: updaterOrValue => {
      columnFiltersState!.value = valueUpdater(updaterOrValue, columnFiltersState!);
      if (paginationState) {
        paginationState.value.pageIndex = DEFAULT_COMPONENT_PAGE_NUMBER;
      }
      search(mapValues(keyBy(columnFiltersState!.value, 'id'), 'value') as unknown as VM);
    },
    onSortingChange: updaterOrValue => {
      sortingState!.value = valueUpdater(updaterOrValue, sortingState!);
      if (paginationState) {
        paginationState.value.pageIndex = DEFAULT_COMPONENT_PAGE_NUMBER;
      }
      changeSort(sortingState!.value.map(({ id, desc }) => `${id}${OrderDelimiter}${desc ? 'desc' : 'asc'}`));
    },
    onPaginationChange: updaterOrValue => {
      const paginationStateRaw = toRaw(paginationState!.value);
      const newPaginationStateRaw = valueUpdater(updaterOrValue, ref(paginationStateRaw)) as PaginationState;
      if (paginationStateRaw.pageSize !== newPaginationStateRaw.pageSize) {
        paginationState!.value.pageIndex = DEFAULT_COMPONENT_PAGE_NUMBER;
        paginationState!.value.pageSize = newPaginationStateRaw.pageSize;
        changeLimit?.(newPaginationStateRaw.pageSize);
      } else if (paginationStateRaw.pageIndex !== newPaginationStateRaw.pageIndex) {
        paginationState!.value.pageIndex = newPaginationStateRaw.pageIndex;
        changePage?.(newPaginationStateRaw.pageIndex);
      }
    },
    initialState: {
      columnFilters: columnFiltersState?.value,
      sorting: sortingState?.value,
      pagination: paginationState?.value,
      columnPinning: columnPinningState?.value
    },
    state: {
      // get expanded() {
      //   return expanded.value;
      // },
      // get columnVisibility() {
      //   return columnVisibility.value;
      // },
      get rowSelection() {
        return rowSelectionState.value;
      },
      get columnFilters() {
        return columnFiltersState?.value;
      },
      get sorting() {
        return sortingState?.value;
      },
      get pagination() {
        return paginationState?.value;
      }
    }
  });
  return { table, data };
}

export function useTanstackSingle<VM extends object, T>({
  fetchBuilder,
  fetchParamsBuilder,
  paramsBuilder,
  errorBuilder,
  validateParams,
  cls,
  watchRoute = true,
  immediate = true,
  filterModelBuilder
}: SingleOptions<VM, PlainOf<VM>, T>) {
  const {
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    validateParams: defaultValidateParams,
    errorBuilder: defaultErrorBuilder
  } = useDefaultBuilder({
    cls,
    fetchParamsBuilder,
    paramsBuilder,
    errorBuilder,
    validateParams
  });

  const { defaultParams, normalParams, loading, data, search, refresh } = useSingle<
    VM,
    PlainOf<VM>,
    T,
    'data',
    Service.RestfulResult<T>
  >({
    fetchBuilder,
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    errorBuilder: defaultErrorBuilder,
    validateParams: defaultValidateParams,
    watchRoute,
    immediate,
    resultField: 'data'
  });

  useFilterModel<VM>({
    defaultParams,
    filterModelBuilder,
    search,
    validateParams: defaultValidateParams
  });

  return {
    defaultParams,
    normalParams,
    loading,
    data,
    search,
    refresh
  };
}

export function useTanstackPaging<VM extends Pageable, T, Plain extends PlainOf<VM> = PlainOf<VM>>({
  columns,
  getRowId,
  fetchBuilder,
  fetchParamsBuilder,
  paramsBuilder,
  errorBuilder,
  validateParams,
  after,
  cls,
  watchRoute = true,
  immediate = true,
  filterModelBuilder,
  columnPinningState
}: PageOptions<VM, Plain, T>) {
  const {
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    validateParams: defaultValidateParams,
    errorBuilder: defaultErrorBuilder
  } = useDefaultBuilder({ cls, fetchParamsBuilder, paramsBuilder, errorBuilder, validateParams });

  const { defaultParams, loading, pagination, search, changePage, changeLimit, changeSort, refresh } = usePaging<
    VM,
    Plain,
    Service.Pagination<T>,
    'data',
    Service.RestfulResult<Service.Pagination<T>>
  >({
    fetchBuilder,
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    errorBuilder: defaultErrorBuilder,
    validateParams: defaultValidateParams,
    after,
    watchRoute,
    immediate,
    resultField: 'data',
    defaultPageNumber: DEFAULT_COMPONENT_PAGE_NUMBER
  });

  const columnFiltersState = ref<ColumnFiltersState>(toTanstackColumnFilters(defaultParams));
  const sortingState = ref<SortingState>(toTanstackSorting(defaultParams));
  const paginationState = ref<PaginationState>(toTanstackPagination(defaultParams));

  const { filterOptions } = useFilterModel<VM>({
    defaultParams,
    filterModelBuilder,
    async search(vm) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      table.setColumnFilters(toTanstackColumnFilters(vm ?? {}));
    },
    validateParams: defaultValidateParams
  });

  const { data, table } = useTanstackTable<T, VM>({
    columns,
    getRowId,
    columnPinningState,
    columnFiltersState,
    sortingState,
    paginationState,
    search,
    changeSort,
    changePage,
    changeLimit
  });

  watch(pagination, n => {
    if (n) {
      data.value = n.content;
      table.setOptions(v => {
        return {
          ...v,
          rowCount: n.totalElements
        };
      });
    }
  });

  return {
    table,
    defaultParams,
    loading,
    data,
    search,
    refresh,
    filterComponents: getFilterButton(filterOptions.value)
  };
}

export function useTanstackListing<VM extends Pageable, T, Plain extends PlainOf<VM> = PlainOf<VM>>({
  columns,
  getRowId,
  fetchBuilder,
  fetchParamsBuilder,
  paramsBuilder,
  errorBuilder,
  validateParams,
  after,
  cls,
  watchRoute = true,
  immediate = true,
  filterModelBuilder,
  columnPinningState
}: ListingOptions<VM, Plain, T>) {
  const {
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    validateParams: defaultValidateParams,
    errorBuilder: defaultErrorBuilder
  } = useDefaultBuilder({ cls, fetchParamsBuilder, paramsBuilder, errorBuilder, validateParams });

  const { defaultParams, loading, list, search, changeSort, refresh } = useListing<
    VM,
    Plain,
    T,
    'data',
    Service.RestfulResult<T[]>
  >({
    fetchBuilder,
    fetchParamsBuilder: defaultFetchParamsBuilder,
    paramsBuilder: defaultParamsBuilder,
    errorBuilder: defaultErrorBuilder,
    validateParams: defaultValidateParams,
    after,
    watchRoute,
    immediate,
    resultField: 'data'
  });

  const columnFiltersState = ref<ColumnFiltersState>(toTanstackColumnFilters(defaultParams));
  const sortingState = ref<SortingState>(toTanstackSorting(defaultParams));

  const { filterOptions } = useFilterModel<VM>({
    defaultParams,
    filterModelBuilder,
    async search(vm) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      table.setColumnFilters(toTanstackColumnFilters(vm ?? {}));
    },
    validateParams: defaultValidateParams
  });

  const { data, table } = useTanstackTable<T, VM>({
    columns,
    getRowId,
    columnPinningState,
    columnFiltersState,
    sortingState,
    search,
    changeSort
  });

  watch(list, n => {
    if (n) {
      data.value = n;
    }
  });

  return {
    table,
    defaultParams,
    loading,
    data,
    search,
    refresh,
    filterComponents: getFilterButton(filterOptions.value)
  };
}
