<script setup lang="tsx">
import type { Column } from '@tanstack/vue-table';
import { cn } from '@/lib/utils';
defineProps<{
  column: Column<any, unknown>;
}>();
</script>

<template>
  <Button variant="link" class="!p-1" @click="column.toggleSorting()">
    <IconRadixIconsArrowDown
      v-if="column.getIsSorted() === 'asc'"
      :class="cn(column.getIsSorted() ? 'text-primary' : 'text-muted-foreground')"
    ></IconRadixIconsArrowDown>
    <IconRadixIconsArrowUp
      v-else
      :class="cn(column.getIsSorted() ? 'text-primary' : 'text-muted-foreground')"
    ></IconRadixIconsArrowUp>
  </Button>
</template>
