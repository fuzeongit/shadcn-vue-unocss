import { Icon } from '@iconify/vue';
import { UserStatusDictionary } from '@/constants/enum/user-status';
import { dictionaryToOption, extractOption } from '@/components/nameless/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type SelectTagOption<T extends Nameless.Form.SelectValue> = Nameless.Form.SelectOption<T> & {
  children?: Nameless.Form.SelectOption<T>[];
};

type BuildTagOptions<T extends Nameless.Form.SelectValue> = {
  hasSelect: boolean;
  status?: T;
  class?: string;
  statusOptions: Nameless.Form.SelectOption<T>[];
  fillLabel?: boolean;
};

function buildTag<T extends Nameless.Form.SelectValue = Nameless.Form.SelectValue>(options: BuildTagOptions<T>) {
  const label = extractOption(options.status, options.statusOptions) || (options.fillLabel ? options.status : '');
  return (
    <div
      class={cn(options.class, {
        'cursor-pointer': options.hasSelect
      })}
    >
      {label}
      {options.hasSelect && <Icon icon="icon-park-outline:down"></Icon>}
    </div>
  );
}

function buildHasSelectTag<T extends Nameless.Form.SelectValue = Nameless.Form.SelectValue>(
  children: Nameless.Form.SelectOption<T>[],
  options: BuildTagOptions<T>,
  handleSelect?: (status?: T) => void
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger as-child>{buildTag(options)}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {children.map(it => (
          <DropdownMenuItem key={it.value} asChild>
            <div onClick={() => handleSelect?.(it.value)}>{extractOption(it.value, children)}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildPermissionTag<T extends Nameless.Form.SelectValue = Nameless.Form.SelectValue>(
  permission: boolean,
  options: {
    statusOptions: Nameless.Form.SelectOption<T>[];
    tagOptions: SelectTagOption<T>[];
    status: T;
    handleSelect?: (status?: T) => void;
  }
) {
  const option = options.tagOptions.find(item => item.value === options.status);
  const children = option?.children ?? [];
  const hasSelect = Boolean(children.length);

  if (permission) {
    if (children.length) {
      return buildHasSelectTag(
        children,
        {
          hasSelect,
          status: options.status,
          class: option?.label,
          statusOptions: options.statusOptions
        },
        options.handleSelect
      );
    }
    return buildTag({
      hasSelect,
      status: options.status,
      class: option?.label,
      statusOptions: options.statusOptions
    });
  }
  return buildTag({
    hasSelect: false,
    status: options.status,
    class: option?.label,
    statusOptions: options.statusOptions
  });
}

export function renderUserStatus(status: number, permission: boolean, handleSelect?: (status?: number) => void) {
  return buildPermissionTag<number>(permission, {
    statusOptions: dictionaryToOption(UserStatusDictionary, true),
    tagOptions: [
      {
        label: 'tag-blue-xs',
        value: 0,
        children: [
          {
            label: '测试',
            value: 1
          }
        ]
      },
      {
        label: 'tag-red-xs',
        value: 1,
        children: [
          {
            label: '测试2',
            value: 0
          }
        ]
      }
    ],
    status,
    handleSelect
  });
}
