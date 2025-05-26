import type { PlainOf } from '@/hooks/paging';
import type { Params } from '@/params/user';
import { fetchClient } from '..';

export const userApi = {
  paging(params: PlainOf<Params>) {
    return fetchClient.get<Service.Pagination<UserModule.User>>('/user/paging', {
      params
    });
  },
  list(params: PlainOf<Params>) {
    return fetchClient
      .get<Service.Pagination<UserModule.User>>('/user/paging', {
        params
      })
      .then(res => ({
        code: res.code,
        data: res.data.content
      }));
  }
};
