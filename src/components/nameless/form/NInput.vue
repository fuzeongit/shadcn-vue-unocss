<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { omit } from 'lodash-es';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line vue/no-unused-properties
    defaultValue?: string | number;
    modelValue?: string | number;
    // eslint-disable-next-line vue/no-reserved-props
    class?: HTMLAttributes['class'];
    clearable?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    defaultValue: undefined,
    modelValue: undefined,
    class: undefined,
    placeholder: $t('nameless.form.input.placeholder'),
    clearable: false,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', payload?: string | number): void;
}>();
</script>

<template>
  <NInputBorder as="div" role="input" :disabled="disabled" :class="cn('group/input_border', props.class)">
    <Input
      v-bind="omit(props, ['clearable', 'class'])"
      class="border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto peer"
      data-slot="input"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <NClearButton
      v-if="clearable"
      :visible="modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled"
      @click="emit('update:modelValue')"
    ></NClearButton>
    <slot name="suffix" />
  </NInputBorder>
</template>

<style lang="css" scoped>
.parent:has(input:focus-visible) {
  color: red;
}
</style>
