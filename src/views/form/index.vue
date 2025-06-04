<script setup lang="tsx">
import { h } from 'vue';
import { pick } from 'lodash-es';
import * as z from 'zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { SelectOptions } from '@/constants/dictionary/select-options';
import { fetchMock2 } from '@/services';
import { useI18nStore } from '@/store/modules/i18n';
import { dictionaryToOption } from '@/components/nameless/form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';

const i18nStore = useI18nStore();
const mode = useColorMode();
class Dto {
  public str?: 'str3' | 'str1' | 'str2';
  public num = 9999;
  public sel = 'next.js';
  public mulSel = [];
  public remSel = 'nuxt';
  public remMulSel = ['next.js', 'sveltekit', 'nuxt'];
  public date = Date.now();
  public datetime = Date.now();
  public dateRange = [];
  public datetimeRange = [];
  public str2 = '2';
}

const formSchema = toTypedSchema(
  z.object({
    str: z.enum(['str1', 'str2', 'str3']),
    num: z.number().min(91).max(10000).optional(),
    sel: z.string(),
    mulSel: z.array(z.string()).min(2),
    remSel: z.string(),
    remMulSel: z.array(z.string()).min(3),
    date: z.number().int().positive(),
    datetime: z.number().int().positive().max(new Date('2024-12-20').getTime()),
    dateRange: z.union([
      z.tuple([z.number().int().positive(), z.number().int().positive().max(new Date('2025-12-20').getTime())]),
      z.array(z.number().int().positive()).min(2)
    ]),
    datetimeRange: z.union([
      z.tuple([z.number().int().positive(), z.number().int().positive().max(new Date('2025-12-20').getTime())]),
      z.array(z.number().int().positive()).min(2)
    ])
  })
);

const { validate, setValues, controlledValues, setFieldValue, resetForm, resetField, validateField, errors } = useForm({
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

const handleResetField = async () => {
  // 要校验的字段
  const keys = ['str', 'mulSel'];
  // // 获取要校验的字段当前是否有 error ，如果有，则不应该继续 validateField
  // const errs = pick(errors.value, keys);
  // // 提取出应该校验的字段
  // const shouldValidateFields = keys.filter(key => !errs[key as keyof typeof errs]);

  // resetForm({ values: controlledValues.value });

  await Promise.all(keys.map(key => validateField(key as keyof typeof controlledValues.value)));

  ['num', 'sel', 'remSel', 'remMulSel', 'date', 'datetime', 'dateRange', 'datetimeRange'].forEach(key => {
    if (errors.value[key]) {
      resetField(key, {
        value: controlledValues.value[key],
        valid: false
      });
    }
  });

  // resetForm({ values: controlledValues.value });

  // console.log(errs, shouldValidateFields);
  // validateField('str');
};
const t = ref('12');

const popoverRef = ref();

const showPopover = event => {
  popoverRef.value.show(event.target);
};
</script>

<template>
  <div>
    <NInput v-model="t" placeholder="str"></NInput>
    <br />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          <IconRadixIconsMoon class="h-[1.2rem] w-[1.2rem] dark:hidden block"></IconRadixIconsMoon>
          <IconRadixIconsSun class="h-[1.2rem] w-[1.2rem] dark:block hidden" />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'auto'">System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          <SvgIcon
            icon="radix-icons:moon"
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <SvgIcon
            icon="radix-icons:sun"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="i18nStore.changeLanguage('zh-CN')">zh-CN</DropdownMenuItem>
        <DropdownMenuItem @click="i18nStore.changeLanguage('zh-HK')">zh-HK</DropdownMenuItem>
        <DropdownMenuItem @click="i18nStore.changeLanguage('en-US')">en-US</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div class="space-x-4">
      <Button @click="changeData">changeData</Button>
      <Button @click="changeValue">changeValue</Button>
      <Button @click="showDialog">dialog</Button>
      <Button @click="resetForm()">resetForm</Button>
      <Button @click="handleResetField">resetField</Button>
      <Button @click="showPopover">popover</Button>
    </div>
    <form class="space-y-6 w-[300px]">
      <FormField v-slot="{ field }" name="str">
        <FormItem v-auto-animate>
          <FormLabel>Str</FormLabel>
          <FormControl>
            <NInput
              :model-value="field.value"
              placeholder="str"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            >
              <template #suffix>
                <div class="flex-center">
                  USDT
                  <IconMdiAccountCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
                </div>
              </template>
            </NInput>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="num">
        <FormItem v-auto-animate>
          <FormLabel>
            Num
            <span class="c-destructive">*</span>
          </FormLabel>
          <FormControl>
            <NNumberInput
              :model-value="field.value"
              placeholder="num"
              :min="90"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            >
              <template #suffix>
                <div class="flex-center">
                  USDT
                  <IconMdiAccountCircle class="h-4 w-4 opacity-50 text-muted-foreground" />
                </div>
              </template>
            </NNumberInput>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="sel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>Sel</FormLabel>
          <FormControl>
            <NSelect
              :options="dictionaryToOption(SelectOptions)"
              placeholder="sel"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NSelect>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="remSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>RemSel</FormLabel>
          <FormControl>
            <NSelect
              :options="fetchMock2"
              placeholder="remSel"
              :model-value="field.value"
              remote
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NSelect>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="mulSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>MulSel</FormLabel>
          <FormControl>
            <NTagsWithCombobox
              :options="dictionaryToOption(SelectOptions)"
              placeholder="mulSel"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NTagsWithCombobox>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="remMulSel" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>RemMulSel</FormLabel>
          <FormControl>
            <NTagsWithCombobox
              :options="fetchMock2"
              placeholder="remMulSel"
              :model-value="field.value"
              remote
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NTagsWithCombobox>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="date" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <NDatePicker
              placeholder="date"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NDatePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="dateRange" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>DateRange</FormLabel>
          <FormControl>
            <NDateRangePicker
              placeholder="dateRange"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NDateRangePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="datetime" :validate-on-input="false">
        {{ field.value }}
        <FormItem v-auto-animate>
          <FormLabel>Datetime</FormLabel>
          <FormControl>
            <NDatetimePicker
              placeholder="datetime"
              :model-value="field.value"
              clearable
              @update:model-value="field['onUpdate:modelValue']"
            ></NDatetimePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="datetimeRange" :validate-on-input="false">
        <FormItem v-auto-animate>
          <FormLabel>DatetimeRange</FormLabel>
          <FormControl>
            <NDatetimeRangePicker
              placeholder="datetimeRange"
              :model-value="field.value"
              clearable
              class="test"
              @update:model-value="field['onUpdate:modelValue']"
            ></NDatetimeRangePicker>
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="button" @click.prevent="onSubmit">Submit</Button>
    </form>

    <NPopover ref="popoverRef">123</NPopover>
  </div>
</template>
