<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import dayjs from 'dayjs';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import { useI18nInject } from '../common/i18n.inject';
import NInputBorder from './NInputBorder.vue';

defineComponent({
  name: 'NDatePicker'
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
    placeholder: $t('nameless.form.datePicker.placeholder'),
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
      <NInputBorder
        role="picker"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn('group/input_border', props.class)"
      >
        <template v-if="modelValue">
          <div class="flex-1 truncate">
            {{ df.format(new Date(modelValue)) }}
          </div>
        </template>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <button
          v-if="clearable"
          tabindex="-1"
          :data-clearable="modelValue !== undefined && modelValue !== null && !disabled ? 'visible' : 'hidden'"
          :class="cn('items-center px-1 hidden group-hover/input_border:data-[clearable=visible]:flex')"
          data-slot="clear"
          type="button"
          @click.prevent.stop="emit('update:modelValue', undefined as any)"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
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
