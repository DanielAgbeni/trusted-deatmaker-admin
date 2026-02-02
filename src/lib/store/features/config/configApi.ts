import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CountriesResponse } from '../auth/types';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.trusteddealmaker.com/api/v1',
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesResponse, void>({
      query: () => '/public/config/countries',
      // Cache for 1 hour since countries don't change often
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCountriesQuery } = configApi;