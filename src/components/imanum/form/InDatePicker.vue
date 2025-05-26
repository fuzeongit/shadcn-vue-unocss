<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import dayjs from 'dayjs';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useI18nInject } from '../common/i18n.inject';
import InInputBorder from './InInputBorder.vue';

defineComponent({
  name: 'InDatePicker'
});

const props = withDefaults(
  defineProps<{
    defaultValue?: number;
    modelValue?: number;
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    defaultValue: undefined,
    modelValue: undefined,
    class: undefined,
    placeholder: undefined,
    clearable: false,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const i18nInject = useI18nInject();

const modelValue = useVModel(props, 'modelValue', emit, {
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
      <InInputBorder
        role="picker"
        :aria-expanded="open"
        :disabled="disabled"
        :class="
          cn(
            'flex flex-nowrap',
            {
              '[&>[data-slot=clear]]:hover:flex': modelValue !== undefined && modelValue !== null && !disabled
            },
            props.class
          )
        "
      >
        <template v-if="modelValue">
          <div class="flex-1 truncate">
            {{ df.format(new Date(modelValue)) }}
          </div>
        </template>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <button
          v-if="clearable"
          :class="cn('flex items-center px-1 hidden')"
          data-slot="clear"
          type="button"
          @click.prevent.stop="emit('update:modelValue', undefined as any)"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </InInputBorder>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-auto">
      <Calendar v-model="localValue" initial-focus :locale="locale" />
    </PopoverContent>
  </Popover>
</template>

<style></style>
