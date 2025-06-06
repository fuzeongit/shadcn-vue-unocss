<script setup lang="ts">
import { omit } from 'lodash-es';
import { cn } from '@/lib/utils';
import { $t } from '@/locales';
import type { BaseInputProps } from './type';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends BaseInputProps<string | number> {}

const props = withDefaults(defineProps<Props>(), {
  placeholder: $t('nameless.form.input.placeholder'),
  clearable: true,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', payload?: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  // eslint-disable-next-line vue/no-undef-properties
  defaultValue: props.defaultValue,
  passive: true,
  deep: true
});
</script>

<template>
  <NInputBorder as="div" role="textbox" :disabled="props.disabled" :class="cn('group/input_border', props.class)">
    <Input
      v-bind="omit(props, ['clearable', 'class'])"
      class="border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto"
      data-slot="input"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @update:model-value="modelValue = $event"
    />

    <NClearButton
      v-if="props.clearable"
      :visible="modelValue !== undefined && modelValue !== null && modelValue !== '' && !props.disabled"
      @click="emit('update:modelValue')"
    ></NClearButton>
    <slot name="suffix" />
  </NInputBorder>
</template>
