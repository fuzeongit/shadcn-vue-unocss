<script lang="tsx" setup generic="VM extends object">
import { useFilterInject } from '@/hooks/filter';
import { FormField } from '@/components/ui/form';
const props = defineProps<{
  id: string;
}>();

const open = ref(false);

const { search, filterOptions, form } = useFilterInject<QuickFilter.DatetimeOption, VM>()!;

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
          <IconIconoirFilterSolid
            v-if="field.value !== undefined && field.value !== null"
            class="text-primary"
          ></IconIconoirFilterSolid>
          <IconIconoirFilter v-else class="text-muted-foreground"></IconIconoirFilter>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <NDatetimePicker
          :picker="false"
          :model-value="field.value"
          v-bind="filterOption.option"
          @update:model-value="field['onUpdate:modelValue']?.($event)"
        />
        <div class="flex items-center justify-between gap-2 p-3 border-t">
          <Button class="flex-1" variant="outline" @click="reset">重置</Button>
          <Button class="flex-1" @click="query">确定</Button>
        </div>
      </PopoverContent>
    </Popover>
  </FormField>
</template>
