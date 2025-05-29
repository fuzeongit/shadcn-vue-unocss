import { defineStore } from 'pinia';

interface AuthState {
  isInit: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isInit: true
  }),

  getters: {
    isLogin: _ => true
  },

  actions: {
    hasPermission(_: PermissionModule.Permission | PermissionModule.Permission[]): boolean {
      // if (Array.isArray(permission)) {
      //   return permission.some(perm => this.info.permissions.includes(perm));
      // }
      // return this.info.permissions.includes(permission);
      return true;
    }
  }
});
