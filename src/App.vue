<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { toast } from '@/components/ui/toast';
import { I18N_INJECTION_KEY } from './components/nameless/common/i18n.inject';
import { useDialog } from './components/nameless/dialog';
const dialog = useDialog();
window.$dialog = dialog;
window.$toast = toast;

provide(I18N_INJECTION_KEY, {
  locale: ref('zh-CN')
});
</script>

<template>
  <RouterView></RouterView>
  <Toaster />
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <VueQueryDevtools></VueQueryDevtools>
</template>
