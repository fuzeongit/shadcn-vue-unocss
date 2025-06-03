<script lang="ts" setup generic="T extends Nameless.Form.SelectValue | Nameless.Form.SelectValue[]">
import type { HTMLAttributes } from 'vue';
import { Icon } from '@iconify/vue';
import { Search } from 'lucide-vue-next';
import { ListboxContent, ListboxFilter, ListboxGroup, ListboxItem, ListboxRoot, Primitive } from 'reka-ui';
import { cn } from '@/lib/utils';

interface Props {
  defaultValue?: T;
  modelValue?: T;
  options: Nameless.Form.SelectOption<Nameless.Form.SelectValue>[];
  searchValue?: string;
  defaultSearchValue?: string;
  multiple?: boolean;
  // eslint-disable-next-line vue/no-reserved-props
  class?: HTMLAttributes['class'];
}

defineComponent({
  name: 'NRemoteCommand'
});

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: T): void;
  (e: 'update:searchValue', v: string): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue as any,
  passive: true,
  deep: true
}) as Ref<T>;

const searchValue = useVModel(props, 'searchValue', emit, {
  defaultValue: props.defaultSearchValue as any,
  passive: true,
  deep: true
}) as Ref<string>;
</script>

<template>
  <ListboxRoot
    v-model="modelValue"
    :multiple="multiple"
    :class="
      cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', props.class)
    "
  >
    <div class="flex items-center border-b px-3" cmdk-input-wrapper>
      <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <ListboxFilter
        v-model="searchValue"
        auto-focus
        :class="
          cn(
            'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          )
        "
      />
    </div>
    <ListboxContent v-if="options.length" :class="cn('max-h-[300px] overflow-y-auto overflow-x-hidden')">
      <div role="presentation">
        <ListboxGroup
          :class="
            cn(
              'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'
            )
          "
        >
          <ListboxItem
            v-for="option in options"
            :key="option.value"
            :class="
              cn(
                'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 group/command_item'
              )
            "
            :value="option.value"
          >
            <span class="absolute right-2 flex items-center justify-center">
              <Icon
                icon="radix-icons:check"
                :class="cn('mr-2 h-4 w-4 hidden group-data-[state=checked]/command_item:flex')"
              />
            </span>
            {{ option.label }}
          </ListboxItem>
        </ListboxGroup>
      </div>
    </ListboxContent>
    <Primitive v-else :class="cn('py-6 text-center text-sm')">{{ $t('nameless.remoteCommand.empty') }}</Primitive>
  </ListboxRoot>
</template>

<style></style>
