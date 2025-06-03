<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { cn } from '@/lib/utils';

interface Props extends PrimitiveProps {
  visible: boolean;
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
}

defineComponent({
  name: 'NClearButton'
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
    :data-state="visible"
    data-slot="clear"
    tabindex="-1"
    type="button"
    :class="
      cn(
        'opacity-0 scale-95 pointer-events-none items-center px-1 transition-all duration-200 ease-in-out group-hover/input_border:data-[state=true]:opacity-100 group-hover/input_border:data-[state=true]:scale-100 group-hover/input_border:data-[state=true]:pointer-events-auto flex',
        props.class
      )
    "
  >
    <slot>
      <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
    </slot>
  </Primitive>
</template>
