<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { cn } from '@/lib/utils';
interface Props extends PrimitiveProps, /* @vue-ignore */ HTMLAttributes {}

defineComponent({
  name: 'NInputBorder'
});

const props = withDefaults(defineProps<Props>(), {
  as: 'button'
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="
      cn(
        'flex flex-nowrap h-9 w-full items-center text-left rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring outline-none data-[state=open]:ring-1 data-[state=open]:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
