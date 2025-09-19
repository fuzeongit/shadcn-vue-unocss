<script lang="ts" setup generic="T extends SelectValue">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import type { SelectValue } from '../form/type';
import NInputBorder from './NInputBorder.vue';
import type { BaseInputProps, LocalCombobox, RemoteCombobox } from './type';
import { useCacheOptions } from '.';

interface Props extends BaseInputProps<T> {
  picker?: boolean;
}

defineComponent({
  name: 'NSelect'
});

const props = withDefaults(defineProps<Props & (RemoteCombobox<T> | LocalCombobox<T>)>(), {
  placeholder: $t('nameless.form.select.placeholder'),
  remote: false,
  clearable: true,
  disabled: false,
  picker: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: T): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue as any,
  passive: true,
  deep: true
}) as Ref<T | undefined>;

const open = ref(false);
const divRef = ref<HTMLDivElement>();
const style = useElementBounding(() => divRef.value);

const { searchValue, cacheOptions, currentOptions } = useCacheOptions<T>(props);

const popoverContentStyle = computed(() => ({ width: `${style.width.value}px` }));

const select = (option: T) => {
  open.value = false;
  modelValue.value = option;
};

const displayValue = computed(() => cacheOptions.value.find(it => it.value === modelValue.value));
</script>

<template>
  <!-- eslint-disable vue/no-duplicate-attr-inheritance -->
  <Popover v-if="picker" v-model:open="open">
    <PopoverTrigger as-child>
      <NInputBorder
        ref="divRef"
        :role="remote ? 'combobox' : 'select'"
        :aria-expanded="open"
        :disabled="props.disabled"
        :class="cn('group/input_border', props.class)"
        v-bind="$attrs"
      >
        <div v-if="displayValue" class="flex-1 truncate">
          {{ displayValue?.label ?? modelValue }}
        </div>
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
    <PopoverContent class="p-0" :style="popoverContentStyle">
      <NRemoteCommand
        :search-value="searchValue"
        :model-value="modelValue"
        :options="currentOptions"
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
    @update:model-value="select"
    @update:search-value="searchValue = $event"
  ></NRemoteCommand>
</template>

<style></style>
