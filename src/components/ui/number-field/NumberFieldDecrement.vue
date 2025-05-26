<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { Minus } from 'lucide-vue-next'
import { NumberFieldDecrement, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldDecrement data-slot="decrement" v-bind="forwarded" :class="cn('disabled:cursor-not-allowed disabled:opacity-20 px-1', props.class)">
    <slot>
      <Minus class="h-4 w-4" />
    </slot>
  </NumberFieldDecrement>
</template>
