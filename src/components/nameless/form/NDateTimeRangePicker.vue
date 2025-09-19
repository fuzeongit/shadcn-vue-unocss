<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import { useVModel } from '@vueuse/core';
import dayjs from 'dayjs';
import { eq } from 'lodash-es';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import type { BaseInputProps } from './type';
import { extractDatetime, useDateFormatter } from '.';

interface Props extends BaseInputProps<(number | undefined)[]> {
  picker?: boolean;
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: () => [],
  placeholder: $t('nameless.form.datetimeRangePicker.placeholder'),
  clearable: true,
  disabled: false,
  picker: true,
  dateTimeFormatOptions: () => ({
    dateStyle: 'short',
    timeStyle: 'medium',
    hourCycle: 'h23'
  })
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: (number | undefined)[]): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  // eslint-disable-next-line vue/no-undef-properties
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});

const { dateFormatter, locale } = useDateFormatter(props.dateTimeFormatOptions);

const localValue = computed<{
  dateRange: DateRange;
  startTime: ReturnType<typeof extractDatetime>;
  endTime: ReturnType<typeof extractDatetime>;
}>({
  get() {
    const [t0, t1] = modelValue.value ?? [];
    const startDay = t0 ? dayjs(t0) : undefined;
    const endDay = t1 ? dayjs(t1) : undefined;
    return {
      dateRange: {
        start: startDay ? new CalendarDate(startDay.year(), startDay.month() + 1, startDay.date()) : undefined,
        end: endDay ? new CalendarDate(endDay.year(), endDay.month() + 1, endDay.date()) : undefined
      },
      startTime: extractDatetime(t0),
      endTime: extractDatetime(t1, true)
    };
  },
  set({ dateRange: { start, end }, startTime, endTime }) {
    const out: (number | undefined)[] = [undefined, undefined];
    if (start) {
      const d = start.toDate(getLocalTimeZone());
      d.setHours(startTime.hours, startTime.minutes, startTime.seconds);
      out[0] = d.getTime();
    }
    if (end) {
      const d = end.toDate(getLocalTimeZone());
      d.setHours(endTime.hours, endTime.minutes, endTime.seconds);
      out[1] = d.getTime();
    }
    if (out[0] && out[1]) {
      if (out[0] > out[1]) {
        if (eq(startTime, localValue.value.startTime)) {
          out[0] = out[1];
        }
        if (eq(endTime, localValue.value.endTime)) {
          out[1] = out[0];
        }
      }
    }
    modelValue.value = out;
  }
});

const dateRange = computed<DateRange>({
  get: () => localValue.value.dateRange,
  set: val => {
    // spread 一次 localValue，替换 dateRange 字段
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, dateRange: val };
  }
});

// six computed props for direct v-model binding on inputs
const startHour = computed<number>({
  get: () => localValue.value.startTime.hours,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, startTime: { ...lv.startTime, hours: val } };
  }
});
const startMinute = computed<number>({
  get: () => localValue.value.startTime.minutes,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, startTime: { ...lv.startTime, minutes: val } };
  }
});
const startSecond = computed<number>({
  get: () => localValue.value.startTime.seconds,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, startTime: { ...lv.startTime, seconds: val } };
  }
});
const endHour = computed<number>({
  get: () => localValue.value.endTime.hours,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, endTime: { ...lv.endTime, hours: val } };
  }
});
const endMinute = computed<number>({
  get: () => localValue.value.endTime.minutes,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, endTime: { ...lv.endTime, minutes: val } };
  }
});
const endSecond = computed<number>({
  get: () => localValue.value.endTime.seconds,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, endTime: { ...lv.endTime, seconds: val } };
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
  <!-- eslint-disable vue/no-duplicate-attr-inheritance -->
  <Popover v-if="picker" v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        role="combobox"
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
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0" />
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="dateRange" initial-focus :number-of-months="2" :locale="locale" />
      <div class="p-3 border-t space-y-4">
        <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
          <div>
            <p class="mb-1 text-sm font-medium">{{ $t('nameless.form.datetimeRangePicker.startTime') }}</p>
            <div class="flex gap-2">
              <Input
                v-model="startHour"
                type="number"
                min="0"
                max="23"
                :placeholder="$t('nameless.form.datetimeRangePicker.hour')"
                class="h-8"
              />
              <Input
                v-model="startMinute"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimeRangePicker.minute')"
                class="h-8"
              />
              <Input
                v-model="startSecond"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimeRangePicker.second')"
                class="h-8"
              />
            </div>
          </div>
          <div>
            <p class="mb-1 text-sm font-medium">{{ $t('nameless.form.datetimeRangePicker.endTime') }}</p>
            <div class="flex gap-2">
              <Input
                v-model="endHour"
                type="number"
                min="0"
                max="23"
                :placeholder="$t('nameless.form.datetimeRangePicker.hour')"
                class="h-8"
              />
              <Input
                v-model="endMinute"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimeRangePicker.minute')"
                class="h-8"
              />
              <Input
                v-model="endSecond"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimeRangePicker.second')"
                class="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
  <div v-else>
    <RangeCalendar v-model="dateRange" initial-focus :number-of-months="2" :locale="locale" />
    <div class="p-3 border-t space-y-4">
      <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
        <div>
          <p class="mb-1 text-sm font-medium">{{ $t('nameless.form.datetimeRangePicker.startTime') }}</p>
          <div class="flex gap-2">
            <Input
              v-model="startHour"
              type="number"
              min="0"
              max="23"
              :placeholder="$t('nameless.form.datetimeRangePicker.hour')"
              class="h-8"
            />
            <Input
              v-model="startMinute"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimeRangePicker.minute')"
              class="h-8"
            />
            <Input
              v-model="startSecond"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimeRangePicker.second')"
              class="h-8"
            />
          </div>
        </div>
        <div>
          <p class="mb-1 text-sm font-medium">{{ $t('nameless.form.datetimeRangePicker.endTime') }}</p>
          <div class="flex gap-2">
            <Input
              v-model="endHour"
              type="number"
              min="0"
              max="23"
              :placeholder="$t('nameless.form.datetimeRangePicker.hour')"
              class="h-8"
            />
            <Input
              v-model="endMinute"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimeRangePicker.minute')"
              class="h-8"
            />
            <Input
              v-model="endSecond"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimeRangePicker.second')"
              class="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
