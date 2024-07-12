import { api } from '../../api/api'; import { Issue } from '../../types/Issue';
;
import type {
  CreateIssue,
  DeleteIssue,
  dndOrderData,
  IssueQuery,
  Issues,
  reorderIssues,
  UpdateIssue,
  MoveIssue,
  BadgeIssue,
  SearchIssueQuery,
  RestartIssue,
  UpdatePeriodReferenceIssue,
} from '../apiTypes';

export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    issues: builder.query<Issues, IssueQuery>({
      query: ({ projectId, userId: uid }) => ({
        url: `project/${projectId}/issues${uid ? '?userId=' + uid : ''}`,
      }),
      providesTags: ['Issues'],
    }),
    issuesPartial: builder.query<Issues, IssueQuery>({
      query: ({ projectId, userId: uid }) => ({
        url: `project/${projectId}/issues/partial${uid ? '?userId=' + uid : ''}`,
      }),
      providesTags: ['IssuesPartial'],
    }),
    searchIssues: builder.query<Issues, SearchIssueQuery>({
      query: ({ query }) => ({
        url: `issue/searchIssues?`,
        params: { query, projectId: 0 }
      }),
      providesTags: ['Issues'],
    }),
    createIssue: builder.mutation<void, CreateIssue>({
      query: (body) => ({ url: 'issue/create', method: 'POST', body }),
      invalidatesTags: ['Issues'],
    }),
    updateIssue: builder.mutation<void, UpdateIssue>({
      query: ({ id, body }) => ({
        url: `issue/${id}/update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Issues'],
    }),
    restartIssue: builder.mutation<void, RestartIssue>({
      query: ({ id, body }) => ({
        url: `issue/${id}/restart`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Issues'],
    }),
    updatePeriodReference: builder.mutation<void, UpdatePeriodReferenceIssue>({
      query: ({ issueId, selectedPeriodReference }) => ({
        url: `issue/${issueId}/updatePeriodReference`,
        method: 'PATCH',
        body: { issueId, selectedPeriodReference },
      }),
      invalidatesTags: ['Issues'],
    }),
    deleteIssue: builder.mutation<void, DeleteIssue>({
      query: ({ issueId, projectId }) => ({
        url: `issue/${issueId}/delete`,
        method: 'DELETE',
        body: { projectId },
      }),
      invalidatesTags: ['Issues'],
    }),
    reorderIssues: builder.mutation<void, reorderIssues>({
      query: (body) => ({ url: 'issue/reorder', method: 'PUT', body }),
      invalidatesTags: ['Issues'],
      async onQueryStarted({ s, d, projectId }, { dispatch }) {
        dispatch(
          extendedApi.util.updateQueryData('issues', { projectId }, (oldIssues) =>
            updateIssueOrderLocally(oldIssues, {
              s: { sId: s.sId, index: s.order - 1 },
              d: { dId: d.dId, index: d.newOrder - 1 },
            })
          )
        );
      },
    }),
    moveIssue: builder.mutation<void, MoveIssue>({
      query: ({ issueId, newOrder, projectId, listId }) => ({
        url: `issue/${issueId}/move`,
        method: 'PATCH',
        body: { issueId, newOrder, projectId, listId },
      }),
      invalidatesTags: ['Issues'],
    }),

    badgeIssue: builder.mutation<void, BadgeIssue>({
      query: ({ issueId, listBadge }) => ({
        url: `issue/${issueId}/update/badge`,
        method: 'PATCH',
        body: { issueId, listBadge },
      }),
      invalidatesTags: ['Issues'],
    }),
  }),
  overrideExisting: false,
});

// hooks
export const {
  useIssuesQuery,
  useIssuesPartialQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useReorderIssuesMutation,
  useSearchIssuesQuery,
  useUpdatePeriodReferenceMutation,
} = extendedApi;

// selectors
interface IssueSelector extends IssueQuery {
  listId: number;
}

export const selectIssuesArray = ({ listId, ...query }: IssueSelector) =>
  extendedApi.useIssuesQuery(query, {
    selectFromResult: ({ data }) => ({
      issues: data ? data[listId] : [],
    }),
    refetchOnMountOrArgChange: true,
  });

  export const selectIssuesPartialArray = ({ listId, ...query }: IssueSelector) =>
  extendedApi.useIssuesPartialQuery(query, {
    selectFromResult: ({ data }) => ({
      issues: data ? data[listId] : [],
    }),
    refetchOnMountOrArgChange: true,
  });

export const { useMoveIssueMutation, useBadgeIssueMutation, useRestartIssueMutation } = extendedApi;

// helpers
const updateIssueOrderLocally = (issues: Issues, { s, d }: dndOrderData) => {
  const source = issues[s.sId].slice(0);
  const target = issues[d.dId].slice(0);
  const draggedIssue = source.splice(s.index, 1)[0]; // remove dragged item from its source list
  (s.sId === d.dId ? source : target).splice(d.index, 0, draggedIssue); // insert dragged item into target list
  return { ...issues, [d.dId]: target, [s.sId]: source } as Issues;
};  
