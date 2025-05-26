<script lang="tsx" setup generic="VM extends object">
import { useFilterInject } from '@/hooks/filter';
import { FormField } from '@/components/ui/form';

const props = defineProps<{
  id: string;
}>();

const open = ref(false);
const { search, filterOptions, form } = useFilterInject<QuickFilter.SelectOption, VM>()!;

const filterOption = computed(() => filterOptions.value.find(x => x.id === props.id)!);

const query = () => {
  open.value = false;
  search();
};

const reset = () => {
  form.resetField(filterOption.value.id);
  query();
};

const searchValue = ref<string>();

const frameworks = asyncComputed(
  () =>
    typeof filterOption.value.option.options === 'function'
      ? filterOption.value.option.options(searchValue.value)
      : filterOption.value.option.options.filter(it =>
          searchValue.value === undefined ? true : it.label.includes(searchValue.value)
        ),
  []
);
</script>

<template>
  <FormField v-slot="{ field }" as="div" class="flex flex-col gap-2" :name="props.id">
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
      <PopoverContent>
        <div class="flex flex-col gap-2">
          <InRemoteCommand
            v-model:search-value="searchValue"
            :model-value="field.value"
            :options="frameworks"
            @update:model-value="field['onUpdate:modelValue']"
          ></InRemoteCommand>
          <div class="flex items-center justify-between gap-2">
            <Button class="flex-1" variant="outline" @click="reset">重置</Button>
            <Button class="flex-1" @click="query">确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </FormField>
</template>
