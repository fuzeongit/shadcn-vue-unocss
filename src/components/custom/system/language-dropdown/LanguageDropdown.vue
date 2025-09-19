<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { useI18nStore } from '@/store/modules/i18n';
import { Language } from '@/locales';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const i18nStore = useI18nStore();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :class="cn('h-7 w-7', props.class)">
        <IconLucideLanguages
          icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <span class="sr-only">dropdown language</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-for="(v, k) in Language" :key="k" @click="i18nStore.changeLanguage(k)">
        {{ v }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
