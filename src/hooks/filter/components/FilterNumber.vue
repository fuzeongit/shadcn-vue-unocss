<script lang="tsx" setup generic="VM extends object">
import { useFilterInject } from '@/hooks/filter';
import { FormField } from '@/components/ui/form';
const props = defineProps<{
  id: string;
}>();

const open = ref(false);
const { search, filterOptions, form } = useFilterInject<QuickFilter.NumberOption, VM>()!;

const filterOption = computed(() => filterOptions.value.find(x => x.id === props.id)!);

const query = () => {
  open.value = false;
  search();
};

const reset = () => {
  form.resetField(filterOption.value.id);
  query();
};
</script>

<template>
  <FormField v-slot="{ field }" :name="props.id">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="link" class="!p-1">
          <IconIconoirFilterSolid v-if="field.value && field.value" class="text-primary"></IconIconoirFilterSolid>
          <IconIconoirFilter v-else class="text-muted-foreground"></IconIconoirFilter>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div class="flex flex-col gap-2">
          <NNumberInput
            :model-value="field.value"
            :placeholder="filterOption.option.placeholder"
            :min="filterOption.option.min"
            :max="filterOption.option.max"
            :step="filterOption.option.step"
            clearable
            @update:model-value="field['onUpdate:modelValue']"
          ></NNumberInput>
          <div class="flex items-center justify-between gap-2">
            <Button class="flex-1" variant="outline" @click="reset">重置</Button>
            <Button class="flex-1" @click="query">确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </FormField>
</template>
