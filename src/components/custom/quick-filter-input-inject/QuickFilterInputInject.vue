<script setup lang="tsx">
import { FilterType } from '@/hooks/filter/constants';
import { useFilterInject } from '@/hooks/filter';
import { cn } from '@/lib/utils';
import { FormField } from '@/components/ui/form';
const { search, form, filterOptions, reset } = useFilterInject()!;
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 flex-wrap">
      <FormField v-for="item in filterOptions" v-slot="{ field }" :key="item.id" :name="item.id">
        <InInput
          v-if="item.option.type === FilterType.String"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InInput>

        <InNumberInput
          v-if="item.option.type === FilterType.Number"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :placeholder="item.option.placeholder"
          :min="item.option.min"
          :max="item.option.max"
          :step="item.option.step"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InNumberInput>

        <InSelect
          v-if="item.option.type === FilterType.Select"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :options="item.option.options"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InSelect>

        <InSelect
          v-if="item.option.type === FilterType.RemoteSelect"
          :model-value="field.value"
          remote
          :class="cn('md:w-48', item.option.class)"
          :options="item.option.options"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InSelect>

        <InTagsWithCombobox
          v-if="item.option.type === FilterType.MultiSelect"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :options="item.option.options"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InTagsWithCombobox>

        <InTagsWithCombobox
          v-if="item.option.type === FilterType.RemoteMultiSelect"
          :model-value="field.value"
          remote
          :class="cn('md:w-48', item.option.class)"
          :options="item.option.options"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InTagsWithCombobox>

        <InDatePicker
          v-if="item.option.type === FilterType.Date"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InDatePicker>

        <InDateRangePicker
          v-if="item.option.type === FilterType.DateRange"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          :placeholder="item.option.placeholder"
          :clearable="item.option.clearable ?? true"
          @update:model-value="field['onUpdate:modelValue']"
        ></InDateRangePicker>
      </FormField>
      <Button @click="search">Search</Button>
      <Button variant="outline" @click="reset">Reset</Button>
      <slot :form="form"></slot>
    </div>
  </div>
</template>
