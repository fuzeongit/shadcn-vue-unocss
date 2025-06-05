<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { cn } from '@/lib/utils';

interface Props extends PrimitiveProps {
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
}

defineComponent({
  name: 'NInputBorder'
});

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  class: undefined
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="
      cn(
        'flex flex-nowrap h-9 w-full items-center text-left rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 has-[:focus-visible]:ring-1 data-[state=open]:ring-1 focus-visible:ring-1 has-[:focus-visible]:ring-ring data-[state=open]:ring-ring focus-visible:ring-ring aria-[invalid=true]:ring-1! aria-[invalid=true]:ring-destructive!',

        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
