// 提取所有组件的实例类型
declare namespace Expose {
  type GlobalComponents = import('vue').GlobalComponents;
  type ComponentInstances = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [K in keyof GlobalComponents]: InstanceType<GlobalComponents[K]>;
  };
}
