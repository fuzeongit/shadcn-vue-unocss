import { fetchClient } from '..';

export const countryApi = {
  listAll() {
    return fetchClient.get<CountryModule.Country[]>('/country/list-all');
  }
};
