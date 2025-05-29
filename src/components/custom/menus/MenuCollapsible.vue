<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Collapsible } from '../../ui/collapsible';
import type { MenuItem } from './type';

const props = defineProps<{
  menu: MenuItem;
}>();

const router = useRouter();
const route = useRoute();

const handleMenuClick = (url: string) => {
  router.push(url);
};

const getSubItems = (children: MenuItem[]) => {
  const withChildren = children.filter(menu => menu.children?.length);
  const withoutChildren = children.filter(menu => !menu.children?.length);
  return { withChildren, withoutChildren };
};

const open = ref((route.name! as string).includes(props.menu.name));

watch(
  () => route.name,
  n => {
    open.value = (n as string).includes(props.menu.name);
  }
);
</script>

<template>
  <Collapsible v-if="menu.children?.length" v-model:open="open" as-child>
    <SidebarMenuItem>
      <CollapsibleTrigger as-child>
        <SidebarMenuButton :tooltip="menu.title">
          <SvgIcon :icon="menu.icon" :local-icon="menu.localIcon"></SvgIcon>
          <span>{{ menu.title }}</span>
          <IconLucideChevronRight
            v-if="menu.children?.length"
            :data-state="open ? 'open' : 'closed'"
            class="ml-auto transition-transform duration-200 data-[state=open]:rotate-90"
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent v-if="menu.children?.length">
        <SidebarMenuSub class="mx-0 pr-0">
          <div v-for="subItem in getSubItems(menu.children).withChildren" :key="subItem.name">
            <RecursiveMenu :menus="[subItem]" />
          </div>
          <SidebarMenuSubItem
            v-for="subItem in getSubItems(menu.children).withoutChildren"
            :key="subItem.name"
            class="cursor-pointer"
          >
            <SidebarMenuSubButton
              :data-state="route.path === subItem.url ? 'checked' : 'unchecked'"
              class="data-[state=checked]:bg-sidebar-accent data-[state=checked]:text-sidebar-accent-foreground"
              @click="handleMenuClick(subItem.url)"
            >
              <SvgIcon :icon="menu.icon" :local-icon="menu.localIcon"></SvgIcon>
              <span class="select-none">{{ subItem.title }}</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
  <SidebarMenuItem v-else>
    <SidebarMenuButton
      :tooltip="menu.title"
      :data-state="route.path === menu.url ? 'checked' : 'unchecked'"
      class="data-[state=checked]:bg-sidebar-accent data-[state=checked]:text-sidebar-accent-foreground"
      @click="handleMenuClick(menu.url)"
    >
      <SvgIcon :icon="menu.icon" :local-icon="menu.localIcon"></SvgIcon>
      <span>{{ menu.title }}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
</template>
