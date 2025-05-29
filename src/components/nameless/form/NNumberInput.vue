<script lang="ts" setup>
import { type HTMLAttributes } from 'vue';
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<
  NumberFieldRootProps & {
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    placeholder?: string;
    clearable?: boolean;
  }
>();
const emit = defineEmits<NumberFieldRootEmits>();

defineComponent({
  name: 'NNumberInput'
});
</script>

<template>
  <NInputBorder as="div" role="input" :disabled="disabled" class="group/input_border">
    <NumberField
      v-bind="props"
      @update:model-value="emit('update:modelValue', (Number.isNaN($event) ? undefined : $event) as any)"
    >
      <NumberFieldContent class="w-full flex">
        <NumberFieldInput
          :placeholder="placeholder"
          :class="cn('w-full border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto ')"
        />
        <button
          v-if="clearable"
          :data-clearable="modelValue !== undefined && modelValue !== null && !disabled ? 'visible' : 'hidden'"
          :class="cn('hidden items-center px-1 group-hover/input_border:data-[clearable=visible]:flex')"
          data-slot="clear"
          type="button"
          @click="emit('update:modelValue', undefined as any)"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
        <slot name="suffix" />
        <NumberFieldDecrement />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </NInputBorder>
</template>

<style></style>
