<script lang="ts" setup generic="T extends Nameless.Form.SelectValue">
import { type HTMLAttributes } from 'vue';
import { unionBy } from 'lodash-es';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import NInputBorder from './NInputBorder.vue';

defineComponent({
  name: 'NSelect'
});

type Remote = {
  remote?: true;
  options: (value?: string) => Promise<Nameless.Form.SelectOption<T>[]>;
};

type Local = {
  remote?: false;
  options: Nameless.MaybePromise<Nameless.Form.SelectOption<T>[]>;
};

const props = withDefaults(
  defineProps<
    {
      defaultValue?: T;
      modelValue?: T;
      // eslint-disable-next-line vue/no-reserved-props
      class?: HTMLAttributes['class'];
      placeholder?: string;
      clearable?: boolean;
      disabled?: boolean;
    } & (Remote | Local)
  >(),
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
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ref="divRef"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn('flex flex-nowrap group/input_border', props.class)"
      >
        <div
          v-if="
            cacheFrameworks.find(
              // eslint-disable-next-line vue/no-undef-properties
              (it: Nameless.Form.SelectOption) => it.value === modelValue
            )
          "
          class="flex-1 truncate"
        >
          {{ cacheFrameworks.find((it: Nameless.Form.SelectOption) => it.value === modelValue)?.label ?? modelValue }}
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <button
          v-if="clearable"
          :data-clearable="
            modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled ? 'visible' : 'hidden'
          "
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
