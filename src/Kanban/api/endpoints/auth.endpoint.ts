import { api } from '../../api/api';;
import { AuthUser, PublicUser, updateAuthUser } from '../apiTypes';
import { UserPhotoProfile } from '../../types/User'

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authUser: builder.query<AuthUser, void>({
      query: () => ({ url: 'user/authUser' }),
      providesTags: ['AuthUser'],
    }),
    selectUsers: builder.query<AuthUser, void>({
      query: () => ({ url: 'user/selectUsers' }),
      providesTags: ['AuthUser'],
    }),
    publicUser: builder.query<PublicUser, number>({
      query: (id) => ({ url: `user/${id}` }),
    }),
    updateAuthUser: builder.mutation<AuthUser, updateAuthUser>({
      query: (body) => ({
        url: 'user/authUser/update',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AuthUser'],
    }),
    updatePhotoProfileUser: builder.mutation<void, FormData>({
      query: (body) => ({
        url: 'user/update/photo',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserPhotoProfile'],
    }),
  }),
  overrideExisting: false,
}); 

export const { useAuthUserQuery, useSelectUsersQuery, useUpdateAuthUserMutation, useUpdatePhotoProfileUserMutation, usePublicUserQuery } = extendedApi;

// selectors
export const selectAuthUser = () =>
  extendedApi.useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({ authUser: data }),
  });

  export const selectUsers = () =>
  extendedApi.useSelectUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({ authUser: data }),
  });
