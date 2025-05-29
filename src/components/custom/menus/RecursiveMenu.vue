<script setup lang="ts">
import type { GeneratedRoute } from '@elegant-router/types';
import { useAuthStore } from '@/store/modules/auth';
import { generatedRoutes } from '@/router/elegant/routes';
import { $t } from '@/locales';
import type { MenuItem } from './type';

const authStore = useAuthStore();

function filterConstantHiddenRoutes(routes: GeneratedRoute[]): MenuItem[] {
  return routes
    .filter(
      it =>
        !it.meta?.constant &&
        !it.meta?.hidden &&
        (it.meta?.permissions?.length ? authStore.hasPermission(it.meta?.permissions) : true)
    )
    .sort((a, b) => {
      return (a.meta?.order ?? Number.MAX_SAFE_INTEGER) - (b.meta?.order ?? Number.MAX_SAFE_INTEGER);
    })
    .map(it => {
      const menuItem: MenuItem = {
        name: it.name,
        url: it.path,
        icon: it.meta?.icon,
        localIcon: it.meta?.localIcon,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        title: $t(it.meta!.i18nKey!)
      };

      if ('children' in it && Array.isArray(it.children)) {
        menuItem.children = filterConstantHiddenRoutes(it.children as GeneratedRoute[]);
      }

      return menuItem;
    });
}

// 将路由转换为菜单项
const menus = computed(() => {
  return filterConstantHiddenRoutes(generatedRoutes);
});
</script>

<template>
  <SidebarMenu>
    <MenuCollapsible v-for="item in menus" :key="item.name" :menu="item"></MenuCollapsible>
  </SidebarMenu>
</template>
