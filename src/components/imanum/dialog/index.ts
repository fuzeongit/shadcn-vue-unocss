import InDialog from '@/components/imanum/dialog/InDialog.vue';

export type DialogOption = {
  title?: string | VNode;
  description?: string | VNode;
  footer?: string | VNode;
  disableOutsidePointerEvents?: boolean;
  escapeClosable?: boolean;
  outsideClosable?: boolean;
};

export function useDialog() {
  function show(option?: DialogOption) {
    const dialogElement = document.createElement('div');
    const dialogApp = createApp(InDialog, {
      onClose() {
        document.body.removeChild(dialogElement);
      }
    });
    const componentRef = dialogApp.mount(dialogElement) as InstanceType<typeof InDialog>;
    document.body.appendChild(dialogElement);
    // 挂载 Dialog 到 dialogElement
    componentRef.show(option);
    return componentRef;
  }

  return {
    show
  };
}
