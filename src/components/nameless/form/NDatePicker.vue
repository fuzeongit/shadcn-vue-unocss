<script lang="ts" setup>
import dayjs from 'dayjs';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import { useI18nInject } from '../common/i18n.inject';
import NInputBorder from './NInputBorder.vue';
import type { BaseInputProps } from '.';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends BaseInputProps<number> {}

defineComponent({
  name: 'NDatePicker'
});

const props = withDefaults(defineProps<Props>(), {
  placeholder: $t('nameless.form.datePicker.placeholder'),
  clearable: true,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const i18nInject = useI18nInject();

const modelValue = useVModel(props, 'modelValue', emit, {
  // eslint-disable-next-line vue/no-undef-properties
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});

const locale = computed(() => i18nInject.locale?.value ?? navigator.language);

const df = computed(
  () =>
    new DateFormatter(locale.value, {
      dateStyle: 'short'
    })
);

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
  <Popover v-model:open="open">
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
            {{ df.format(new Date(modelValue)) }}
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
</template>

<style></style>
