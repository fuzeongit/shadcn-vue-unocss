<script setup lang="tsx">
import { h } from 'vue';
import * as z from 'zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { SelectOptions } from '@/constants/dictionary/select-options';
import { fetchMock2 } from '@/services';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { dictionaryToOption } from '@/components/imanum/form';

const mode = useColorMode();
class Dto {
  public str?: 'str3' | 'str1' | 'str2';
  public num = 9999;
  public sel = 'next.js';
  public mulSel = [];
  public remSel = 'nuxt';
  public remMulSel = ['next.js', 'sveltekit', 'nuxt'];
  public date = Date.now();
  public dateRange = [];
  public str2 = '2';
}

const formSchema = toTypedSchema(
  z.object({
    str: z.enum(['str1', 'str2', 'str3']),
    num: z.number().min(1).max(10000),
    sel: z.string(),
    mulSel: z.array(z.string()).min(2),
    remSel: z.string(),
    remMulSel: z.array(z.string()).min(3),
    date: z.number().int().positive(),
    dateRange: z.union([
      z.tuple([z.number().int().positive(), z.number().int().positive().max(new Date('2024-12-20').getTime())]),
      z.array(z.number().int().positive()).max(0)
    ])
  })
);

const { validate, setValues, controlledValues, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: new Dto()
});

const onSubmit = async () => {
  const validateResult = await validate();
  if (validateResult.valid) {
    toast({
      title: 'You submitted the following values:',
      description: h(
        'pre',
        { class: 'mt-2 w-full rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, JSON.stringify(controlledValues.value, null, 2))
      )
    });
  }
};
const changeData = () => {
  setValues({
    str: 'str2',
    num: 5,
    sel: 'next.js',
    mulSel: ['next.js', 'sveltekit'],
    remSel: 'next.js',
    remMulSel: ['next.js', 'sveltekit'],
    date: Date.now(),
    dateRange: [new Date().getTime(), new Date().getTime()]
  });
};

const changeValue = () => {
  setFieldValue('date', Date.now());
};
const showDialog = () => {
  window.$dialog?.show({ title: <div>123</div> });
};

const test = async () => {
  // resetForm({ values: controlledValues.value });
  // await nextTick();
  // validateField('str');
  console.log(controlledValues.value);
  controlledValues.value.str = 'str1';
};

const a = ref("1");
</script>

<template>
  <div>
    <InCommand
      :options="[
        { label: '123', value: '987' },
        { label: '123', value: '987' }
      ]"
    ></InCommand>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          <Icon
            icon="radix-icons:moon"
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            icon="radix-icons:sun"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'auto'">System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div class="space-x-4">
      <Button @click="changeData">changeData</Button>
      <Button @click="changeValue">changeValue</Button>
      <Button @click="showDialog">dialog</Button>
      <Button @click="resetForm()">resetForm</Button>
      <Button @click="test">resetField</Button>
    </div>
    <form class="space-y-6 w-[300px]">
      <FormField v-slot="{ field }" name="str">
        <FormItem v-auto-animate>
          <FormLabel>Str</FormLabel>
          <FormControl>
            <InInput
              :model-value="field.value"
              placeholder="str"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            >
              <template #suffix>
                <IconMdiAccountCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
              </template>
            </InInput>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="num">
        <FormItem v-auto-animate>
          <FormLabel>Num</FormLabel>
          <FormControl>
            <InNumberInput
              :model-value="field.value"
              placeholder="num"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="sel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>Sel</FormLabel>
          <FormControl>
            <InSelect
              :options="dictionaryToOption(SelectOptions)"
              placeholder="sel"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InSelect>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="remSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>RemSel</FormLabel>
          <FormControl>
            <InSelect
              :options="fetchMock2"
              placeholder="remSel"
              :model-value="field.value"
              remote
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InSelect>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="mulSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>MulSel</FormLabel>
          <FormControl>
            <InTagsWithCombobox
              :options="dictionaryToOption(SelectOptions)"
              placeholder="mulSel"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InTagsWithCombobox>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="remMulSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>RemMulSel</FormLabel>
          <FormControl>
            <InTagsWithCombobox
              :options="fetchMock2"
              placeholder="remMulSel"
              :model-value="field.value"
              remote
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InTagsWithCombobox>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="date" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <InDatePicker
              placeholder="date"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InDatePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="dateRange" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>DateRange</FormLabel>
          <FormControl>
            <InDateRangePicker
              placeholder="dateRange"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></InDateRangePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="click" @click.prevent="onSubmit">Submit</Button>
    </form>
  </div>
</template>
