import { fetchClient } from '..';

export const dictionaryApi = {
  listAll() {
    return fetchClient.get<DictionaryModule.Dictionary[]>('/dictionary/list-all');
  }
};
