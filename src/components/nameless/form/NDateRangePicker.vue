<script setup lang="ts">
import dayjs from 'dayjs';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { type DateRange } from 'reka-ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import { type BaseInputProps, useDateFormatter } from '.';

interface Props extends BaseInputProps<(number | undefined)[]> {
  picker?: boolean;
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: () => [],
  placeholder: $t('nameless.form.dateRangePicker.placeholder'),
  clearable: true,
  disabled: false,
  picker: true,
  dateTimeFormatOptions: () => ({
    dateStyle: 'short'
  })
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: Date[]): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  // eslint-disable-next-line vue/no-undef-properties
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});

const { dateFormatter, locale } = useDateFormatter(props.dateTimeFormatOptions);

const localValue = computed<DateRange>({
  get() {
    const start = modelValue.value?.[0] ? dayjs(modelValue.value[0]) : undefined;
    const end = modelValue.value?.[1] ? dayjs(modelValue.value[1]) : undefined;
    return {
      start: start ? new CalendarDate(start.year(), start.month() + 1, start.date()) : undefined,
      end: end ? new CalendarDate(end.year(), end.month() + 1, end.date()) : undefined
    };
  },
  set({ start, end }) {
    modelValue.value = [start?.toDate(getLocalTimeZone()).getTime(), end?.toDate(getLocalTimeZone()).getTime()];
  }
});

const open = ref(false);

const displayValue = computed(() =>
  modelValue.value?.every(it => it)
    ? modelValue.value.map(it => dateFormatter.value.format(new Date(it!))).join('-')
    : undefined
);
</script>

<template>
  <Popover v-if="picker" v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ole="picker"
        :aria-expanded="open"
        :disabled="props.disabled"
        :class="cn('group/input_border', props.class)"
        v-bind="$attrs"
      >
        <template v-if="displayValue">
          <div class="flex-1 truncate">
            {{ displayValue }}
          </div>
        </template>
        <div v-else class="truncate text-muted-foreground flex-1">{{ props.placeholder }}</div>
        <NClearButton
          v-if="props.clearable"
          :visible="Boolean(modelValue?.length) && !props.disabled"
          @click="emit('update:modelValue', [])"
        ></NClearButton>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="localValue" initial-focus :number-of-months="2" :locale="locale" />
    </PopoverContent>
  </Popover>
  <RangeCalendar v-else v-model="localValue" initial-focus :number-of-months="2" :locale="locale" />
</template>
