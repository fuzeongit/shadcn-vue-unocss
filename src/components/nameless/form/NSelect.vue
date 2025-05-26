<script lang="ts" setup generic="T extends Nameless.Form.SelectValue">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { unionBy } from 'lodash-es';
import { type HTMLAttributes } from 'vue';
import NInputBorder from './NInputBorder.vue';

defineComponent({
  name: 'NSelect'
});

const props = withDefaults(
  defineProps<{
    defaultValue?: T;
    modelValue?: T;
    options: ((value?: string) => Promise<Nameless.Form.SelectOption<T>[]>) | Nameless.Form.SelectOption<T>[];
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    remote?: boolean;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    defaultValue: undefined,
    modelValue: undefined,
    class: undefined,
    placeholder: undefined,
    remote: false,
    disabled: false
  }
);

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

const frameworks = asyncComputed(
  () =>
    typeof props.options === 'function'
      ? props.options(searchValue.value)
      : props.options.filter(it => (searchValue.value === undefined ? true : it.label.includes(searchValue.value))),
  []
);
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
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ref="divRef"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="disabled"
        :class="
          cn(
            'flex flex-nowrap',
            {
              '[&>[data-slot=clear]]:hover:flex':
                modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled
            },
            props.class
          )
        "
      >
        <div v-if="cacheFrameworks.find(it => it.value === modelValue)" class="flex-1 truncate">
          {{ cacheFrameworks.find(it => it.value === modelValue)?.label ?? modelValue }}
        </div>
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
