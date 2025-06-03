<script lang="ts" setup generic="T extends Nameless.Form.SelectValue | Nameless.Form.SelectValue[]">
import { Icon } from '@iconify/vue';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

type UnwrapArray<T> = T extends (infer U)[] ? U : T;

interface Props {
  options: Nameless.Form.SelectOption<UnwrapArray<T>>[];
  defaultValue?: T;
  modelValue?: T;
}

defineComponent({
  name: 'NCommand'
});

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: T): void;
}>();

const modelValue = useVModel(props, 'modelValue', emit, {
  defaultValue: props.defaultValue as any,
  passive: true,
  deep: true
}) as Ref<T>;
</script>

<template>
  <Command v-model="modelValue">
    <CommandInput :placeholder="$t('nameless.command.placeholder')" />
    <CommandEmpty>{{ $t('nameless.command.empty') }}</CommandEmpty>
    <CommandList>
      <CommandGroup>
        <CommandItem v-for="(option, index) in options" :key="index" :value="option.value">
          <span class="absolute right-2 flex items-center justify-center">
            <Icon
              icon="radix-icons:check"
              :class="
                cn(
                  'mr-2 h-4 w-4',
                  (Array.isArray(modelValue) ? modelValue.includes(option.value) : modelValue === option.value)
                    ? 'opacity-100'
                    : 'opacity-0'
                )
              "
            />
          </span>
          {{ option.label }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

<style></style>
