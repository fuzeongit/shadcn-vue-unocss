<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { omit } from 'lodash-es';
import { cn } from '@/lib/utils';

const props = defineProps<{
  // eslint-disable-next-line vue/no-unused-properties
  defaultValue?: string | number;
  modelValue?: string | number;
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', payload?: string | number): void;
}>();
</script>

<template>
  <NInputBorder
    as="div"
    role="input"
    :disabled="disabled"
    :class="cn('flex flex-nowrap group/input_border', props.class)"
  >
    <Input
      v-bind="omit(props, ['clearable', 'class'])"
      class="border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto"
      data-slot="input"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <button
      v-if="clearable"
      :data-clearable="
        modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled ? 'visible' : 'hidden'
      "
      :class="cn('hidden items-center px-1 group-hover/input_border:data-[clearable=visible]:flex')"
      data-slot="clear"
      type="button"
      @click="emit('update:modelValue')"
    >
      <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
    </button>
    <slot name="suffix" />
  </NInputBorder>
</template>

<style lang="css" scoped>
.parent:has(input:focus-visible) {
  color: red;
}
</style>
