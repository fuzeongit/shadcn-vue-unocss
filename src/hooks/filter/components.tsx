import type { VNode } from 'vue';
import { FilterType } from '@/hooks/filter/constants';
import type { TanstackColumnFilterOption } from '@/hooks/filter/models';
import FilterNumber from './components/FilterNumber.vue';
import FilterString from './components/FilterString.vue';
import FilterSelect from './components/FilterSelect.vue';
import FilterMultiSelect from './components/FilterMultiSelect.vue';
import FilterDatePicker from './components/FilterDatePicker.vue';
import FilterDateRangePicker from './components/FilterDateRangePicker.vue';
import FilterDatetimePicker from './components/FilterDatetimePicker.vue';
import FilterDatetimeRangePicker from './components/FilterDatetimeRangePicker.vue';

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
    } else if (item.option.type === FilterType.MultiSelect) {
      components[item.id] = <FilterMultiSelect key={item.id} id={item.id}></FilterMultiSelect>;
    } else if (item.option.type === FilterType.Date) {
      components[item.id] = <FilterDatePicker key={item.id} id={item.id}></FilterDatePicker>;
    } else if (item.option.type === FilterType.DateRange) {
      components[item.id] = <FilterDateRangePicker key={item.id} id={item.id}></FilterDateRangePicker>;
    } else if (item.option.type === FilterType.Datetime) {
      components[item.id] = <FilterDatetimePicker key={item.id} id={item.id}></FilterDatetimePicker>;
    } else if (item.option.type === FilterType.DatetimeRange) {
      components[item.id] = <FilterDatetimeRangePicker key={item.id} id={item.id}></FilterDatetimeRangePicker>;
    }
  });
  return components;
}
