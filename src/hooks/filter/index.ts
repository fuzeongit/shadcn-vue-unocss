import { computed, inject, provide, toRaw } from 'vue';
import { cloneDeep, keyBy, mapValues } from 'lodash-es';
import type { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';
import { type FormContext, type Path, useForm } from 'vee-validate';
import { TanstackColumnFilterOption } from './models';
export const filterProvideKey = Symbol('filter');

export type FilterInject<T extends QuickFilter.ModelOption, VM extends object> = {
  form: FormContext<VM, VM>;
  validateParams: (params: VM, validatorOptions?: ValidatorOptions) => Promise<void>;
  search: () => void;
  reset: () => void;
  filterOptions: ComputedRef<TanstackColumnFilterOption<T, VM>[]>;
};

type FilterOptions<VM extends object> = {
  defaultParams: VM;
  filterModelBuilder?: () => QuickFilter.Model<VM>;
  search: (params?: Partial<VM>) => Promise<void>;
  validateParams: (params: VM, validatorOptions?: ValidatorOptions) => Promise<void>;
};

/** 构建搜索模型的钩子 */
export function useFilterModel<VM extends object>({
  defaultParams,
  filterModelBuilder,
  search,
  validateParams
}: FilterOptions<VM>) {
  const filterModel = computed(() => filterModelBuilder?.() ?? ({} as QuickFilter.Model<VM>));

  const filterOptions = computed(() =>
    (Object.keys(filterModel.value) as Global.StringKeys<VM>[]).map(
      key =>
        new TanstackColumnFilterOption<QuickFilter.ModelOption, VM>(key, defaultParams[key], filterModel.value[key]!)
    )
  );

  const valuesBuilder = () =>
    mapValues(
      keyBy(filterOptions.value, 'id'),
      o => (typeof o.value === 'object' ? cloneDeep(o.value) : o.value) as any
    ) as VM;

  const form = useForm<VM>({ initialValues: valuesBuilder() as any });

  const localSearch = () => {
    search(form.values);
  };

  const reset = () => {
    const defaultValue = plainToClass(defaultParams.constructor as ClassConstructor<VM>, {});
    const object: Partial<VM> = {};
    Object.keys(filterModel.value).forEach(
      // 这里有个问题，这个naive框架的要null才会有响应，undefined就没有响应了
      // 但是我们这里的默认值是undefined，所以需要转换成null
      (key: string) => (object[key as keyof VM] = toRaw(defaultValue[key as keyof VM]))
    );
    form.setValues(object as any);
    localSearch();
  };

  const expose = {
    form,
    validateParams,
    search: localSearch,
    reset,
    filterOptions
  };

  provide(filterProvideKey, expose);

  return expose;
}

export function useFilterInject<T extends QuickFilter.ModelOption, VM extends object>() {
  return inject<FilterInject<T, VM>>(filterProvideKey);
}

export function useFilterField<T extends QuickFilter.ModelOption, VM extends object>(
  id: string,
  { search, filterOptions, form }: FilterInject<T, VM>
) {
  const open = ref(false);

  const filterOption = computed(() => filterOptions.value.find(x => x.id === id)!);

  const query = () => {
    open.value = false;
    search();
  };

  const reset = () => {
    form.resetField(filterOption.value.id as unknown as Path<VM>);
    query();
  };

  return {
    open,
    filterOption,
    query,
    reset
  };
}
