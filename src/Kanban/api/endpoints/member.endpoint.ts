import { api } from '../../api/api';
import type { AddMember, RemoveMember } from '../apiTypes';
import type { Member } from '../../types/Member';
import type { User } from '../../../types/User';

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    members: builder.query<Member[], number>({
      query: (projectId) => ({
        url: `project/${projectId}/members`,
      }),
      providesTags: ['Members'],
    }),
    membersPerBoard: builder.query<Member[], number>({
      query: (projectId) => ({
        url: `project/${projectId}/board/members`,
      }),
      providesTags: ['User'],
    }),
    membersAllProjects: builder.query<Member[], void>({
      query: () => ({
        url: `me/getMyMemberAllProjects`,
      }),
      providesTags: ['Members'],
    }),
    removeMember: builder.mutation<void, RemoveMember>({
      query: (body) => ({
        url: `member/remove`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Members'],
    }),
    addMember: builder.mutation<void, AddMember>({
      query: (body) => ({
        url: `member/add`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Members'],
    }),
  }),
  overrideExisting: false,
});

export const { useMembersQuery, useMembersPerBoardQuery, useMembersAllProjectsQuery, useRemoveMemberMutation, useAddMemberMutation } = extendedApi;

// selectors
export const selectMembers = (projectId: number) =>
  extendedApi.useMembersQuery(projectId, {
    selectFromResult: ({ data }) => ({ members: data }),
  });
  
  export const selectMembersPerBoard = (projectId: number) =>
  extendedApi.useMembersPerBoardQuery(projectId, {
    selectFromResult: ({ data }) => ({ user: data }),
  });

  export const selectMembersAllProjects = () => {
    const result = extendedApi.useMembersAllProjectsQuery();
    const members = result.data;
    return { members };
  };