<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import dayjs from 'dayjs';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { cn } from '@/lib/utils';
import { useI18nInject } from '../common/i18n.inject';

const props = withDefaults(
  defineProps<{
    defaultValue?: (number | undefined)[];
    modelValue?: (number | undefined)[];
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    defaultValue: () => [],
    modelValue: undefined,
    class: undefined,
    placeholder: undefined,
    clearable: false,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: Date[]): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
}) as Ref<(number | undefined)[]>;

const i18nInject = useI18nInject();

const locale = computed(() => i18nInject.locale?.value ?? navigator.language);

const df = computed(
  () =>
    new DateFormatter(locale?.value, {
      dateStyle: 'short'
    })
);

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
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ole="picker"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn('group/input_border', props.class)"
      >
        <div v-if="localValue.start" class="flex-1 truncate">
          <template v-if="localValue.end">
            {{ df.format(localValue.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(localValue.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(localValue.start.toDate(getLocalTimeZone())) }}
          </template>
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <button
          v-if="clearable"
          tabindex="-1"
          :data-clearable="modelValue?.length && !disabled ? 'visible' : 'hidden'"
          :class="cn('items-center px-1 hidden group-hover/input_border:data-[clearable=visible]:flex')"
          data-slot="clear"
          type="button"
          @click.prevent.stop="emit('update:modelValue', [])"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="localValue" initial-focus :number-of-months="2" :locale="locale" />
    </PopoverContent>
  </Popover>
</template>
