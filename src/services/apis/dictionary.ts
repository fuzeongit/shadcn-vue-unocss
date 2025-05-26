import { fetchClient } from '..';

export const dictionaryApi = {
  listAll() {
    return fetchClient.get<DictionaryModule.DictionaryType[]>('/dictionary/list-all');
  },
  listByType(type: string) {
    return fetchClient.get<DictionaryModule.Dictionary[]>('/dictionary/list-by-type', {
      params: { type }
    });
  }
};
