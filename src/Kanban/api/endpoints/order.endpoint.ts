import { api } from '../api';;
import { Orders } from '../apiTypes';
import { UserPhotoProfile } from '../../types/User'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    selectOrders: builder.query<Orders, void>({
      query: () => ({ url: 'orders/select' }),
      providesTags: ['Orders'],
    }),
   
  }),
  overrideExisting: false,
}); 

export const { useSelectOrdersQuery } = extendedApi;

// selectors
export const selectOrders = () =>
  extendedApi.useSelectOrdersQuery(undefined, {
    selectFromResult: ({ data }) => ({ selectOrders: data }),
  });
