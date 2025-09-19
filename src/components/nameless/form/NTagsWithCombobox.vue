<script lang="ts" setup generic="T extends SelectValue">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import type { SelectOption, SelectValue } from '../form/type';
import NInputBorder from './NInputBorder.vue';
import type { BaseInputProps, LocalCombobox, RemoteCombobox } from './type';
import { useCacheOptions } from '.';
interface Props extends BaseInputProps<T[]> {
  picker?: boolean;
}

defineComponent({
  name: 'NTagsWithCombobox'
});

const props = withDefaults(defineProps<Props & (RemoteCombobox<T> | LocalCombobox<T>)>(), {
  defaultValue: () => [],
  placeholder: $t('nameless.form.tagsWithCombobox.placeholder'),
  clearable: true,
  disabled: false,
  picker: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: T[]): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
}) as Ref<T[] | undefined>;

const open = ref(false);
const bsScroll = ref<Expose.ComponentInstances['BetterScroll']>();
const tagsInput = ref<Expose.ComponentInstances['NInputBorder']>();
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
  const isHandleScroll = (modelValue.value?.length ?? 0) < option.length;
  modelValue.value = option;
  if (isHandleScroll) {
    scroll();
  }
};

const { searchValue, cacheOptions, currentOptions } = useCacheOptions<T>(props);

const popoverContentStyle = computed(() => ({ width: `${style.width.value}px` }));

const closeTag = (item: T) => {
  modelValue.value = modelValue.value?.filter(it => it !== item);
};
</script>

<template>
  <!-- eslint-disable vue/no-duplicate-attr-inheritance -->
  <Popover v-if="picker" v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ref="tagsInput"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="props.disabled"
        :class="cn('group/input_border', props.class)"
        v-bind="$attrs"
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
                  <!-- eslint-disable-next-line vue/no-undef-properties -->
                  {{ cacheOptions.find((it: SelectOption) => it.value === item)?.label }}
                </div>
                <button class="flex rounded bg-transparent mr-1" tabindex="-1" @click.prevent.stop="closeTag(item)">
                  <IconRadixIconsCross2 class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsCross2>
                </button>
              </div>
            </div>
          </BetterScroll>
        </div>
        <div v-else class="truncate text-muted-foreground flex-1">{{ props.placeholder }}</div>
        <NClearButton
          v-if="clearable"
          :visible="Boolean(modelValue?.length) && !props.disabled"
          @click="emit('update:modelValue', [])"
        ></NClearButton>
        <slot name="suffix" />
        <IconRadixIconsChevronDown class="w-4 h-4 opacity-50 shrink-0"></IconRadixIconsChevronDown>
      </NInputBorder>
    </PopoverTrigger>
    <PopoverContent class="p-0 popover" :style="popoverContentStyle">
      <NRemoteCommand
        :search-value="searchValue"
        :model-value="modelValue"
        :options="currentOptions"
        multiple
        @update:model-value="select"
        @update:search-value="searchValue = $event"
      ></NRemoteCommand>
    </PopoverContent>
  </Popover>
  <NRemoteCommand
    v-else
    :search-value="searchValue"
    :model-value="modelValue"
    :options="currentOptions"
    multiple
    @update:model-value="select"
    @update:search-value="searchValue = $event"
  ></NRemoteCommand>
</template>

<style></style>
