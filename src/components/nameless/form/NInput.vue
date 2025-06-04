<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { omit } from 'lodash-es';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';

interface Props {
  defaultValue?: string | number;
  modelValue?: string | number;
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: undefined,
  modelValue: undefined,
  class: undefined,
  placeholder: $t('nameless.form.input.placeholder'),
  clearable: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', payload?: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});
</script>

<template>
  <NInputBorder as="div" role="textbox" :disabled="disabled" :class="cn('group/input_border', props.class)">
    <Input
      v-bind="omit(props, ['clearable', 'class'])"
      class="border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto"
      data-slot="input"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="modelValue = $event"
    />

    <NClearButton
      v-if="clearable"
      :visible="modelValue !== undefined && modelValue !== null && modelValue !== '' && !disabled"
      @click="emit('update:modelValue')"
    ></NClearButton>
    <slot name="suffix" />
  </NInputBorder>
</template>
