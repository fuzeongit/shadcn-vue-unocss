<!-- components/GenericPopover.vue -->
<script setup lang="ts">
import type { ReferenceElement } from 'reka-ui';
import { PopoverAnchor } from 'reka-ui';

// 控制 Popover 显示
const open = ref(false);

// 触发元素 ref
const triggerRef = ref<ReferenceElement>();

// 控制方法
function show(refElement: ReferenceElement) {
  if (refElement) {
    triggerRef.value = refElement; // 设置定位元素
  }
  open.value = true; // 打开 Popover
}
function hide() {
  open.value = false; // 关闭 Popover
}

// 暴露方法给父组件
defineExpose({
  show,
  hide
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverAnchor :reference="triggerRef"></PopoverAnchor>
    <PopoverContent class="w-auto p-0">
      <slot></slot>
    </PopoverContent>
  </Popover>
</template>
