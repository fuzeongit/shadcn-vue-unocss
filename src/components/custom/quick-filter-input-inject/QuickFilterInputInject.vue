<script setup lang="tsx">
import { useFilterInject } from '@/hooks/filter';
import { FilterType } from '@/hooks/filter/constants';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
const { search, form, filterOptions, reset } = useFilterInject()!;
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 flex-wrap">
      <FormField v-for="item in filterOptions" v-slot="{ field }" :key="item.id" :name="item.id">
        <NInput
          v-if="item.option.type === FilterType.String"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NInput>

        <NNumberInput
          v-if="item.option.type === FilterType.Number"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NNumberInput>

        <NSelect
          v-if="item.option.type === FilterType.Select"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NSelect>

        <NTagsWithCombobox
          v-if="item.option.type === FilterType.MultiSelect"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NTagsWithCombobox>

        <NDatePicker
          v-if="item.option.type === FilterType.Date"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NDatePicker>

        <NDatetimePicker
          v-if="item.option.type === FilterType.Datetime"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NDatetimePicker>

        <NDateRangePicker
          v-if="item.option.type === FilterType.DateRange"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NDateRangePicker>

        <NDatetimeRangePicker
          v-if="item.option.type === FilterType.DatetimeRange"
          :model-value="field.value"
          :class="cn('md:w-48', item.option.class)"
          v-bind="item.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NDatetimeRangePicker>
      </FormField>
      <Button @click="search">Search</Button>
      <Button variant="outline" @click="reset">Reset</Button>
      <slot :form="form"></slot>
    </div>
  </div>
</template>
