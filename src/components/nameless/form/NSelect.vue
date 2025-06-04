<script lang="ts" setup generic="T extends Nameless.Form.SelectValue">
import { type HTMLAttributes } from 'vue';
import { unionBy } from 'lodash-es';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import NInputBorder from './NInputBorder.vue';

interface Props {
  defaultValue?: T;
  modelValue?: T;
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

type Remote = {
  remote?: true;
  options: (value?: string) => Promise<Nameless.Form.SelectOption<T>[]>;
};

type Local = {
  remote?: false;
  options: Nameless.MaybePromise<Nameless.Form.SelectOption<T>[]>;
};

defineComponent({
  name: 'NSelect'
});

const props = withDefaults(defineProps<Props & (Remote | Local)>(), {
  defaultValue: undefined,
  modelValue: undefined,
  class: undefined,
  placeholder: $t('nameless.form.select.placeholder'),
  remote: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: T): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue as any,
  passive: true,
  deep: true
}) as Ref<T>;

const open = ref(false);
const divRef = ref<HTMLDivElement>();
const style = useElementBounding(() => divRef.value);

const searchValue = ref<string>();

const localOptions = asyncComputed(async () => {
  if (!props.remote) {
    return typeof props.options === 'function' ? await props.options() : props.options;
  }
  return [];
}, []);

const frameworks = asyncComputed(() => {
  return props.remote
    ? props.options(searchValue.value)
    : localOptions.value.filter(it => (searchValue.value === undefined ? true : it.label.includes(searchValue.value)));
}, []);

const popoverContentStyle = computed(() => ({ width: `${style.width.value}px` }));

const cacheFrameworks: Ref<Nameless.Form.SelectOption<T>[]> = ref([]);

const select = (option: T) => {
  open.value = false;
  modelValue.value = option;
};

watch(
  frameworks,
  () => {
    cacheFrameworks.value = unionBy(cacheFrameworks.value, frameworks.value, 'value');
  },
  { immediate: true }
);

const displayValue = computed(() => cacheFrameworks.value.find(it => it.value === modelValue.value));
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ref="divRef"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn('group/input_border', props.class)"
        v-bind="$attrs"
      >
        <div v-if="displayValue" class="flex-1 truncate">
          {{ displayValue?.label ?? modelValue }}
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <NClearButton
          v-if="clearable"
          :visible="modelValue !== undefined && modelValue !== null && !disabled"
          @click="emit('update:modelValue', undefined as any)"
        ></NClearButton>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="p-0" :style="popoverContentStyle">
      <NRemoteCommand
        :search-value="searchValue"
        :model-value="modelValue"
        :options="frameworks"
        @update:model-value="select"
        @update:search-value="searchValue = $event"
      ></NRemoteCommand>
    </PopoverContent>
  </Popover>
</template>

<style></style>
