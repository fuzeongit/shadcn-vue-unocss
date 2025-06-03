<script lang="ts" setup>
import { type HTMLAttributes } from 'vue';
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';

interface Props extends NumberFieldRootProps {
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  placeholder?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: undefined,
  placeholder: $t('nameless.form.numberInput.placeholder'),
  clearable: false
});
const emit = defineEmits<NumberFieldRootEmits>();

defineComponent({
  name: 'NNumberInput'
});
</script>

<template>
  <NInputBorder as="div" role="input" :disabled="disabled" :class="cn('group/input_border', props.class)">
    <NumberField
      v-bind="props"
      @update:model-value="emit('update:modelValue', (Number.isNaN($event) ? undefined : $event) as any)"
    >
      <NumberFieldContent class="w-full flex">
        <NumberFieldInput
          :placeholder="placeholder"
          :class="cn('w-full border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto ')"
        />
        <NClearButton
          v-if="clearable"
          :visible="modelValue !== undefined && modelValue !== null && !disabled"
          @click="emit('update:modelValue', undefined as any)"
        ></NClearButton>
        <slot name="suffix" />
        <NumberFieldDecrement />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </NInputBorder>
</template>

<style></style>
