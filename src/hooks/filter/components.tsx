import type { VNode } from 'vue';
import { FilterType } from '@/hooks/filter/constants';
import type { TanstackColumnFilterOption } from '@/hooks/filter/models';
import FilterNumber from './components/FilterNumber.vue';
import FilterString from './components/FilterString.vue';
import FilterSelect from './components/FilterSelect.vue';
import FilterDatePicker from './components/FilterDatePicker.vue';

export function getFilterButton<VM extends object>(
  filterOptions: TanstackColumnFilterOption<QuickFilter.ModelOption, VM>[]
) {
  const components: Record<string, VNode> = {};
  filterOptions.forEach(item => {
    if (item.option.type === FilterType.String) {
      components[item.id] = <FilterString key={item.id} id={item.id}></FilterString>;
    } else if (item.option.type === FilterType.Number) {
      components[item.id] = <FilterNumber key={item.id} id={item.id}></FilterNumber>;
    } else if (item.option.type === FilterType.Select) {
      components[item.id] = <FilterSelect key={item.id} id={item.id}></FilterSelect>;
    } else if (item.option.type === FilterType.Date) {
      components[item.id] = <FilterDatePicker key={item.id} id={item.id}></FilterDatePicker>;
    }
  });
  return components;
}
