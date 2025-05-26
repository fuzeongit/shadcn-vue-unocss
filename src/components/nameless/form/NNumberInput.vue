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

const suffixRef = ref<HTMLElement>();

const { width } = useElementBounding(suffixRef);
</script>

<template>
  <NumberField
    v-bind="props"
    @update:model-value="emit('update:modelValue', (Number.isNaN($event) ? undefined : $event) as any)"
  >
    <NumberFieldContent
      class="w-full flex"
      :class="
        cn({
          '[&>div>[data-slot=clear]]:hover:flex': modelValue !== undefined && modelValue !== null && !disabled
        })
      "
    >
      <NumberFieldInput
        :placeholder="placeholder"
        :class="cn('w-full px-3')"
        :style="{ marginRight: width * -1 + 'px' }"
      />
      <div ref="suffixRef" class="flex items-center px-3">
        <button
          v-if="clearable"
          :class="cn('flex items-center hidden px-1')"
          data-slot="clear"
          type="button"
          @click="emit('update:modelValue', undefined as any)"
        >
          <IconMdiClearCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
        </button>
        <NumberFieldDecrement />
        <NumberFieldIncrement />
        <slot name="suffix" />
      </div>
    </NumberFieldContent>
  </NumberField>
</template>

<style></style>
