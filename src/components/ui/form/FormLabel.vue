<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import type { LabelProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useFormField } from './useFormField';

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

const { error, formItemId,valid,
isDirty,
isTouched } = useFormField();
</script>

<template>
  <Label :class="cn(error && 'text-destructive', props.class)" :for="formItemId">
    <slot />
  </Label>
</template>
