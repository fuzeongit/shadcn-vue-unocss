<script lang="ts" setup>
import dayjs from 'dayjs';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import NInputBorder from './NInputBorder.vue';
import { type BaseInputProps, useDateFormatter } from '.';

interface Props extends BaseInputProps<number> {
  picker?: boolean;
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions;
}

defineComponent({
  name: 'NDatePicker'
});

const props = withDefaults(defineProps<Props>(), {
  placeholder: $t('nameless.form.datePicker.placeholder'),
  clearable: true,
  picker: true,
  disabled: false,
  dateTimeFormatOptions: () => ({
    dateStyle: 'short'
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

const localValue = computed<CalendarDate | undefined>({
  get() {
    if (modelValue.value) {
      const date = dayjs(modelValue.value);
      return new CalendarDate(date.year(), date.month() + 1, date.date());
    }
    return undefined;
  },
  set(value) {
    modelValue.value = value ? value.toDate(getLocalTimeZone()).getTime() : undefined;
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
        <template v-if="modelValue">
          <div class="flex-1 truncate">
            {{ dateFormatter.format(new Date(modelValue)) }}
          </div>
        </template>
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
      <Calendar v-model="localValue" initial-focus :locale="locale" />
    </PopoverContent>
  </Popover>

  <Calendar v-else v-model="localValue" initial-focus :locale="locale" />
</template>
