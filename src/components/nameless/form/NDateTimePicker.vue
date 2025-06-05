<script lang="ts" setup>
import dayjs from 'dayjs';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import NInputBorder from './NInputBorder.vue';
import type { BaseInputProps } from '.';
import { extractDatetime, useDateFormatter } from '.';

interface Props extends BaseInputProps<number> {
  picker?: boolean;
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
}

defineComponent({
  name: 'NDatePicker'
});

const props = withDefaults(defineProps<Props>(), {
  placeholder: $t('nameless.form.datetimePicker.placeholder'),
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
  (e: 'update:modelValue', v: number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  // eslint-disable-next-line vue/no-undef-properties
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});

const { dateFormatter, locale } = useDateFormatter(props.dateTimeFormatOptions);

const open = ref(false);

const localValue = computed<{
  calendar: CalendarDate | undefined;
  time: ReturnType<typeof extractDatetime>;
}>({
  get() {
    const date = modelValue.value ? dayjs(modelValue.value) : undefined;
    return {
      calendar: date ? new CalendarDate(date.year(), date.month() + 1, date.date()) : undefined,
      time: extractDatetime(modelValue.value)
    };
  },
  set({ calendar, time }) {
    if (calendar) {
      const d = calendar.toDate(getLocalTimeZone());
      d.setHours(time.hours, time.minutes, time.seconds);
      modelValue.value = d.getTime();
    } else {
      modelValue.value = undefined;
    }
  }
});

const calendar = computed({
  get: () => localValue.value.calendar,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, calendar: val };
  }
});

// six computed props for direct v-model binding on inputs
const hour = computed<number>({
  get: () => localValue.value.time.hours,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, time: { ...lv.time, hours: val } };
  }
});
const minute = computed<number>({
  get: () => localValue.value.time.minutes,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, time: { ...lv.time, minutes: val } };
  }
});
const second = computed<number>({
  get: () => localValue.value.time.seconds,
  set: val => {
    const lv = toRaw(localValue.value);
    localValue.value = { ...lv, time: { ...lv.time, seconds: val } };
  }
});
</script>

<template>
  <Popover v-if="picker" v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        role="combobox"
        :aria-expanded="open"
        :disabled="props.disabled"
        :class="cn('group/input_border', props.class)"
        v-bind="$attrs"
      >
        <div v-if="modelValue" class="flex-1 truncate">
          {{ dateFormatter.format(new Date(modelValue)) }}
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ props.placeholder }}</div>
        <NClearButton
          v-if="props.clearable"
          :visible="modelValue !== undefined && modelValue !== null && !props.disabled"
          @click="emit('update:modelValue', undefined as any)"
        ></NClearButton>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-auto">
      <Calendar v-model="calendar" initial-focus :locale="locale" />
      <div class="p-3 border-t space-y-4">
        <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
          <div>
            <div class="flex gap-2">
              <Input
                v-model="hour"
                type="number"
                min="0"
                max="23"
                :placeholder="$t('nameless.form.datetimePicker.hour')"
                class="h-8"
              />
              <Input
                v-model="minute"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimePicker.minute')"
                class="h-8"
              />
              <Input
                v-model="second"
                type="number"
                min="0"
                max="59"
                :placeholder="$t('nameless.form.datetimePicker.second')"
                class="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
  <div v-else>
    <Calendar v-model="calendar" initial-focus :locale="locale" />
    <div class="p-3 border-t space-y-4">
      <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
        <div>
          <div class="flex gap-2">
            <Input
              v-model="hour"
              type="number"
              min="0"
              max="23"
              :placeholder="$t('nameless.form.datetimePicker.hour')"
              class="h-8"
            />
            <Input
              v-model="minute"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimePicker.minute')"
              class="h-8"
            />
            <Input
              v-model="second"
              type="number"
              min="0"
              max="59"
              :placeholder="$t('nameless.form.datetimePicker.second')"
              class="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
