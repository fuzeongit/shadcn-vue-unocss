declare namespace PermissionModule {
  type Permission = keyof typeof import('@/constants/enum/permission').Permission;
}
