import { api } from '../../api/api';;
import type { PermissionKanban, ProfileKanban } from '../apiTypes';

// Crie o endpoint
export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    permissionKanban: builder.query<PermissionKanban[], void>({
      query: () => ({
        url: `user/permissionKanban`,
      }),
      providesTags: ['PermissionKanban'],
    }),
    listProfilesKanban: builder.query<ProfileKanban[], void>({
      query: () => ({
        url: `user/listProfilesKanban`,
      }),
      providesTags: ['ProfileKanban'],
    }),
    updatePermissionKanban: builder.mutation<void, PermissionKanban>({
      query: (body) => ({
        url: `user/updatePermissionKanban`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Members'],
    }),
  }),
  overrideExisting: false,
});

export const { usePermissionKanbanQuery, useListProfilesKanbanQuery, useUpdatePermissionKanbanMutation } = extendedApi

export const selectPermissionKanban = () =>
  usePermissionKanbanQuery(undefined, {
    selectFromResult: ({ data }) => ({ permissionKanban: data }),
  });
