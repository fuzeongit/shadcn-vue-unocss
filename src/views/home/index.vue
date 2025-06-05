<script setup lang="tsx">
import { FlexRender, createColumnHelper } from '@tanstack/vue-table';
import { Icon } from '@iconify/vue';
import { SelectOptions } from '@/constants/dictionary/select-options';
import { fetchMock2 } from '@/services';
import { userApi } from '@/services/apis/user';
import { useI18nStore } from '@/store/modules/i18n';
import { FilterType } from '@/hooks/filter/constants';
import { useTanstackPaging } from '@/hooks/paging';
import { renderUserStatus } from '@/utils/render';
import SortedButton from '@/components/custom/sorted-button/SortedButton.vue';
import { dictionaryToOption } from '@/components/nameless/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Params } from '@/params/user';
const mode = useColorMode();
const i18nStore = useI18nStore();
const columnHelper = createColumnHelper<UserModule.User>();

const { loading, table, filterComponents } = useTanstackPaging<Params, UserModule.User>({
  columns: [
    columnHelper.display({
      id: 'select',
      header: () =>
        h(Checkbox, {
          modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
          'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(Boolean(value)),
          ariaLabel: 'Select all'
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': value => row.toggleSelected(Boolean(value)),
          ariaLabel: 'Select row'
        }),
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
      size: 32
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: 'Id',
      cell: ({ row, column }) => h('div', { class: 'capitalize' }, `${row.getValue('id')} ${column.getStart()}`)
    }),
    columnHelper.accessor('name', {
      id: 'name',
      header: ({ column }) => {
        return (
          <div class="flex items-center">
            Name
            {filterComponents.date}
            {/* {filterComponents.num}
            {/* {filterComponents.sel} 
            {filterComponents.remSel}
            {filterComponents.mulSel}
            {filterComponents.remMulSel}
            {filterComponents.date}
            {filterComponents.dateRange}
            {filterComponents.datetime}
            {filterComponents.datetimeRange} */}
            {/* <FilterString id="str"></FilterString> */}
            <SortedButton column={column}></SortedButton>
          </div>
        );
      },
      cell: ({ row, column }) => h('div', { class: 'lowercase' }, `${row.getValue('name')} ${column.getStart()}`)
    }),
    columnHelper.accessor('birth', {
      header: ({ column }) => {
        return h(
          <div class="flex items-center">
            Birth
            <SortedButton column={column}></SortedButton>
          </div>
        );
      },
      cell: () => {
        // eslint-disable-next-line no-console
        return renderUserStatus(Math.round(Math.random()), true, v => console.log(v));
      }
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => {
        return (
          <div class="flex items-center">
            Email
            <SortedButton column={column}></SortedButton>
          </div>
        );
      },
      cell: ({ row }) => h('div', { class: 'tag-blue-16px' }, row.getValue('email'))
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      size: 80,
      cell: ({ row }) => {
        return (
          <>
            <Button as-child>
              <button
                onClick={() => {
                  row.toggleExpanded();
                }}
              >
                测试
              </button>
            </Button>
          </>
        );
      }
    })
  ],
  fetchBuilder: userApi.paging,
  cls: Params,
  filterModelBuilder: () => ({
    str: {
      type: FilterType.String,
      placeholder: '字符串'
    },
    num: {
      type: FilterType.Number,
      placeholder: '数字'
    },
    sel: {
      type: FilterType.Select,
      options: dictionaryToOption(SelectOptions),
      placeholder: '单选'
    },
    remSel: {
      type: FilterType.Select,
      remote: true,
      options: fetchMock2,
      placeholder: '远端单选'
    },
    mulSel: {
      type: FilterType.MultiSelect,
      options: fetchMock2,
      placeholder: '多选'
    },
    remMulSel: {
      type: FilterType.MultiSelect,
      remote: true,
      options: fetchMock2,
      placeholder: '远端多选'
    },
    date: {
      type: FilterType.Date,
      placeholder: '单一日期'
    },
    datetime: {
      type: FilterType.Datetime,
      placeholder: '单一时间'
    },
    dateRange: {
      type: FilterType.DateRange,
      placeholder: '日期范围',
      class: 'md:w-98'
    },
    datetimeRange: {
      type: FilterType.DatetimeRange,
      placeholder: '时间范围',
      class: 'md:w-98'
    }
  }),
  columnPinningState: ref({
    left: ['select'],
    right: ['actions']
  })
});
const isEmpty = computed(() => table.getRowModel().rows.length === 0);

function* testGenerator(i: number) {
  yield i + 1;
}

const ttt = testGenerator(10);

const change = () => {
  document.documentElement.style.setProperty('--primary', '200 100% 50%'); // 自定义值
};
</script>

<template>
  <div class="w-full">
    {{ $t('test') }}
    <icon-local-vue></icon-local-vue>
    <IconLocalVue></IconLocalVue>
    <SvgIcon local-icon="vue" class="h-6 w-6"></SvgIcon>
    <SvgIcon icon="radix-icons:moon" class="h-6 w-6"></SvgIcon>
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
        <DropdownMenuItem @click="i18nStore.changeLanguage('zh-CN')">zh-CN</DropdownMenuItem>
        <DropdownMenuItem @click="i18nStore.changeLanguage('zh-HK')">zh-HK</DropdownMenuItem>
        <DropdownMenuItem @click="i18nStore.changeLanguage('en-US')">en-US</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button
      @click="
        () => {
          console.log(ttt.next());
        }
      "
    >
      test
    </Button>
    <Button @click="change">test2</Button>
    <QuickFilterInputInject></QuickFilterInputInject>

    <div class="flex items-center py-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <Icon icon="radix-icons:chevron-down" class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter(column => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="
              value => {
                column.toggleVisibility(!!value);
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border max-w-full">
      <Table class="table-fixed md:table-auto min-w-[1080px]">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              :class="cn({ 'sticky bg-background/95': header.column.getIsPinned() })"
              :style="{
                left: header.column.getIsPinned() === 'left' ? header.column.getStart('left') + 'px' : undefined,
                right: header.column.getIsPinned() === 'right' ? header.column.getAfter('right') + 'px' : undefined,
                width: header.column.getIsPinned() ? header.column.getSize() + 'px' : undefined,
                minWidth: !header.column.getIsPinned() ? header.column.getSize() + 'px' : undefined
              }"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isEmpty && loading">
            <TableCell :colspan="table.getAllColumns().length" class="h-24 text-center">loading</TableCell>
          </TableRow>
          <template v-else-if="!isEmpty">
            <!-- eslint-disable-next-line vue/no-v-for-template-key -->
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="
                    cn({ 'sticky bg-background/95': cell.column.getIsPinned(), 'min-w-40': !cell.column.getIsPinned() })
                  "
                  :style="{
                    left: cell.column.getIsPinned() === 'left' ? cell.column.getStart('left') + 'px' : undefined,
                    right: cell.column.getIsPinned() === 'right' ? cell.column.getAfter('right') + 'px' : undefined,
                    width: cell.column.getIsPinned() ? cell.column.getSize() + 'px' : undefined,
                    minWidth: !cell.column.getIsPinned() ? cell.column.getSize() + 'px' : undefined
                  }"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <TableRow v-else>
            <TableCell :colspan="table.getAllColumns().length" class="h-24 text-center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex justify-end items-center gap-1 mt-4">
      <Pagination
        v-slot="{ page }"
        :total="table.getRowCount()"
        :page="table.getState().pagination.pageIndex"
        :sibling-count="1"
        show-edges
        :items-per-page="table.getState().pagination.pageSize"
        @update:page="table.setPageIndex($event)"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious />

          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="`${index}_ellipsis`" />
          </template>

          <PaginationNext />
        </PaginationContent>
      </Pagination>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            {{ table.getState().pagination.pageSize }}
            <Icon icon="radix-icons:chevron-down" class="ml-2 h-4 w-4"></Icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="sizes in [5, 10, 20, 30]"
            :key="sizes"
            class="capitalize"
            :model-value="sizes === table.getState().pagination.pageSize"
            @update:model-value="
              value => {
                table.setPageSize(sizes);
              }
            "
          >
            {{ sizes }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
