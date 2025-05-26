<script setup lang="ts">
import type { VNode } from 'vue';
import { isVNode } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import type { DialogOption } from '.';
const visible = ref(false);
const emit = defineEmits<{ (e: 'close'): void }>();

const title = ref<string | VNode>();
const description = ref<string | VNode>();
const footer = ref<string | VNode>();
const disableOutsidePointerEvents = ref<boolean>();
const escapeClosable = ref<boolean>();
const outsideClosable = ref<boolean>();

defineExpose({
  show(option?: DialogOption) {
    title.value = option?.title;
    description.value = option?.description;
    footer.value = option?.footer;
    disableOutsidePointerEvents.value = option?.disableOutsidePointerEvents ?? true;
    escapeClosable.value = option?.escapeClosable ?? true;
    outsideClosable.value = option?.outsideClosable ?? true;
    visible.value = true;
  },
  close() {
    visible.value = false;
  }
});

watch(visible, value => {
  if (!value) {
    emit('close');
  }
});
</script>

<template>
  <Dialog v-model:open="visible">
    <DialogContent
      class="sm:max-w-[425px]"
      :disable-outside-pointer-events="disableOutsidePointerEvents"
      @escape-key-down="escapeClosable ? $event.preventDefault() : null"
      @interact-outside="outsideClosable ? $event.preventDefault() : null"
    >
      <DialogHeader>
        <DialogTitle v-if="isVNode(title)"><component :is="title" /></DialogTitle>
        <DialogTitle v-else>{{ title }}</DialogTitle>

        <DialogDescription v-if="isVNode(description)">
          <component :is="description" />
        </DialogDescription>
        <DialogDescription v-else>{{ description }}{{ disableOutsidePointerEvents }}</DialogDescription>
      </DialogHeader>
      <DialogFooter v-if="isVNode(footer)">
        <component :is="footer" />
      </DialogFooter>
      <DialogFooter v-else>
        {{ footer }}
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
