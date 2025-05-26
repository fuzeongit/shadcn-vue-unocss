<script lang="ts" setup generic="T extends Imanum.Form.SelectValue">
import type { HTMLAttributes } from 'vue';
import { unionBy } from 'lodash-es';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import InInputBorder from './InInputBorder.vue';
defineComponent({
  name: 'InTagsWithCombobox'
});

const props = withDefaults(
  defineProps<{
    defaultValue?: T[];
    modelValue?: T[];
    options: ((value?: string) => Promise<Imanum.Form.SelectOption<T>[]>) | Imanum.Form.SelectOption<T>[];
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    remote?: boolean;
    clearable?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    defaultValue: () => [],
    modelValue: undefined,
    class: undefined,
    remote: false,
    placeholder: undefined,
    clearable: false,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: T[]): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue as any,
  passive: true,
  deep: true
}) as Ref<T[]>;

const open = ref(false);
const bsScroll = ref<Expose.ComponentInstances['BetterScroll']>();
const tagsInput = ref<Expose.ComponentInstances['InInputBorder']>();
const scrollContent = ref<HTMLDivElement>();
const style = useElementBounding(() => tagsInput.value?.$el);

const scroll = async () => {
  await nextTick();
  const x = bsScroll.value!.$el.clientWidth - scrollContent.value!.clientWidth;

  if (x < 0) {
    bsScroll.value?.instance?.scrollTo(bsScroll.value?.$el.clientWidth - scrollContent.value!.clientWidth, 0, 200);
  }
};

const select = (option: T[]) => {
  const isHandleScroll = modelValue.value.length < option.length;
  modelValue.value = option;
  if (isHandleScroll) {
    scroll();
  }
};

const searchValue = ref<string>();

const frameworks = asyncComputed(
  () =>
    typeof props.options === 'function'
      ? props.options(searchValue.value)
      : props.options.filter(it => (searchValue.value === undefined ? true : it.label.includes(searchValue.value))),
  []
);

const cacheFrameworks: Ref<Imanum.Form.SelectOption<T>[]> = ref([]);

const popoverContentStyle = computed(() => ({ width: `${style.width.value}px` }));

const closeTag = (item: T) => {
  modelValue.value = modelValue.value.filter(it => it !== item);
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
      <InInputBorder
        ref="tagsInput"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="disabled"
        :class="
          cn(
            'flex flex-nowrap',
            {
              '[&>[data-slot=clear]]:hover:flex': modelValue.length && !disabled
            },
            props.class
          )
        "
      >
        <div v-if="modelValue?.length" class="w-full overflow-hidden">
          <BetterScroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: true }">
            <div ref="scrollContent" class="flex gap-2">
              <div
                v-for="(item, index) in modelValue"
                :key="index"
                class="flex h-5 items-center rounded-md bg-secondary data-[state=active]:ring-ring data-[state=active]:ring-2 data-[state=active]:ring-offset-2 ring-offset-background"
                :value="item"
              >
                <div class="py-0.5 px-2 text-sm rounded bg-transparent">
                  {{ cacheFrameworks.find(it => it.value === item)?.label }}
                </div>
                <button class="flex rounded bg-transparent mr-1" @click.prevent.stop="closeTag(item)">
                  <IconRadixIconsCross2 class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsCross2>
                </button>
              </div>
            </div>
          </BetterScroll>
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ placeholder }}</div>
        <button
          v-if="clearable"
          :class="cn('flex items-center px-1 hidden')"
          data-slot="clear"
          type="button"
          @click.prevent.stop="emit('update:modelValue', [])"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </InInputBorder>
    </PopoverTrigger>
    <PopoverContent class="p-0 popover" :style="popoverContentStyle">
      <InRemoteCommand
        :search-value="searchValue"
        :model-value="modelValue"
        :options="frameworks"
        multiple
        @update:model-value="select"
        @update:search-value="searchValue = $event"
      ></InRemoteCommand>
    </PopoverContent>
  </Popover>
</template>

<style></style>
