<script lang="tsx" setup generic="VM extends object">
import dayjs from 'dayjs';
import type { DateValue } from '@internationalized/date';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { useFilterInject } from '@/hooks/filter';
import { useI18nInject } from '@/components/imanum/common/i18n.inject';
import { FormField } from '@/components/ui/form';
const props = defineProps<{
  id: string;
}>();

const open = ref(false);

const { search, filterOptions, form } = useFilterInject<QuickFilter.DateOption, VM>()!;

const filterOption = computed(() => filterOptions.value.find(x => x.id === props.id)!);

const query = () => {
  open.value = false;
  search();
};

const reset = () => {
  form.resetField(filterOption.value.id);
  query();
};

const i18nInject = useI18nInject();

const locale = computed(() => i18nInject.locale?.value ?? navigator.language);

const toCalendarDate = (time?: number) => {
  if (time) {
    const date = dayjs(time);
    return new CalendarDate(date.year(), date.month() + 1, date.date());
  }
  return undefined;
};

const toTime = (value?: DateValue) => {
  return (value ? value.toDate(getLocalTimeZone()).getTime() : undefined) as any;
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
      <PopoverContent>
        <div class="flex flex-col gap-2">
          <Calendar
            :model-value="toCalendarDate(field.value)"
            initial-focus
            :locale="locale"
            @update:model-value="field['onUpdate:modelValue']?.(toTime($event))"
          />
          <div class="flex items-center justify-between gap-2">
            <Button class="flex-1" variant="outline" @click="reset">重置</Button>
            <Button class="flex-1" @click="query">确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </FormField>
</template>
