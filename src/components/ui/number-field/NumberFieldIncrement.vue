<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import type { NumberFieldIncrementProps } from 'reka-ui';
import { Plus } from 'lucide-vue-next';
import { NumberFieldIncrement, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <NumberFieldIncrement
    data-slot="increment"
    v-bind="forwarded"
    :class="cn('disabled:cursor-not-allowed disabled:opacity-20 px-1', props.class)"
  >
    <slot>
      <Plus class="h-4 w-4" />
    </slot>
  </NumberFieldIncrement>
</template>
