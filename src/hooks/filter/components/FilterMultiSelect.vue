<script lang="tsx" setup generic="VM extends object">
import { useFilterField, useFilterInject } from '@/hooks/filter';
import { FormField } from '@/components/ui/form';
const props = defineProps<{
  id: string;
}>();

const filterInject = useFilterInject<QuickFilter.MultiSelectOption, VM>()!;

const { open, filterOption, query, reset } = useFilterField(props.id, filterInject);
</script>

<template>
  <FormField v-slot="{ field }" as="div" class="flex flex-col gap-2" :name="props.id">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="link" class="!p-1">
          <IconIconoirFilterSolid v-if="Boolean(field.value?.length)" class="text-primary"></IconIconoirFilterSolid>
          <IconIconoirFilter v-else class="text-muted-foreground"></IconIconoirFilter>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <NTagsWithCombobox
          :picker="false"
          :model-value="field.value"
          v-bind="filterOption.option"
          @update:model-value="field['onUpdate:modelValue']"
        ></NTagsWithCombobox>
        <div class="flex items-center justify-between gap-2 p-3 border-t">
          <Button class="flex-1" variant="outline" @click="reset">重置</Button>
          <Button class="flex-1" @click="query">确定</Button>
        </div>
      </PopoverContent>
    </Popover>
  </FormField>
</template>
