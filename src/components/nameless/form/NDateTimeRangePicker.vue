<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref, toRaw } from 'vue';
import { useVModel } from '@vueuse/core';
import dayjs from 'dayjs';
import { eq } from 'lodash-es';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import { useI18nInject } from '../common/i18n.inject';
import { extractDatetime } from '.';

interface Props {
  defaultValue?: (number | undefined)[];
  modelValue?: (number | undefined)[];
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: () => [],
  modelValue: undefined,
  class: undefined,
  placeholder: $t('nameless.form.datetimeRangePicker.placeholder'),
  clearable: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: (number | undefined)[]): void;
}>();

// v-model binding (deep = true)
const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
}) as Ref<(number | undefined)[]>;

// i18n & formatter
const i18nInject = useI18nInject();
const locale = computed(() => i18nInject.locale?.value ?? navigator.language);
const df = computed(
  () =>
    new DateFormatter(locale.value, {
      dateStyle: 'short',
      timeStyle: 'medium',
      hourCycle: 'h23'
    })
);

// single computed to map between modelValue[] and calendar + times
const localValue = computed<{
  dateRange: DateRange;
  startTime: ReturnType<typeof extractDatetime>;
  endTime: ReturnType<typeof extractDatetime>;
}>({
  get() {
    const [t0, t1] = modelValue.value;
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
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        role="picker"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn('group/input_border', props.class)"
      >
        <div v-if="modelValue[0] != null && modelValue[1] != null" class="flex-1 truncate">
          {{ df.format(new Date(modelValue[0]!)) }}
          –
          {{ df.format(new Date(modelValue[1]!)) }}
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">
          {{ placeholder }}
        </div>
        <NClearButton
          v-if="clearable"
          :visible="Boolean(modelValue?.length) && !disabled"
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
</template>
