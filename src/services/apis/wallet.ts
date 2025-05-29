import { fetchClient } from '..';

export const wattleApi = {
  listAll() {
    return fetchClient.get<WattleModule.Wattle[]>('/wallet/list-all');
  }
};
