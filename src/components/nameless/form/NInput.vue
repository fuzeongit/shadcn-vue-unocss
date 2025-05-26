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

const suffixRef = ref<HTMLElement>();

const { width } = useElementBounding(suffixRef);
</script>

<template>
  <div
    :class="
      cn(
        'w-full flex',
        modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled
          ? '[&>div>[data-slot=clear]]:hover:flex'
          : '',
        props.class
      )
    "
  >
    <Input
      v-bind="omit(props, ['clearable', 'class'])"
      data-slot="input"
      :style="{ marginRight: width * -1 + 'px', paddingRight: width - 12 + 'px' }"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <div ref="suffixRef" class="flex items-center px-3">
      <button
        v-if="clearable"
        :class="cn('flex items-center px-1 hidden')"
        data-slot="clear"
        type="button"
        @click="emit('update:modelValue')"
      >
        <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
      </button>
      <slot name="suffix" />
    </div>
  </div>
</template>
