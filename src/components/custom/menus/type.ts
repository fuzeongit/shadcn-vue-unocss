export interface MenuItem {
  name: string;
  url: string;
  icon?: string;
  localIcon?: string;
  title: string;
  children?: MenuItem[];
}
