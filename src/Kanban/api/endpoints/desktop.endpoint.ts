import { api } from '../../api/api';
import type { CreateDesktop, EditDesktop, LeaveDesktop, Desktop } from '../apiTypes';

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        desktops: builder.query<Desktop[], number>({
            query: (userId) => ({ url: `user/${userId}/desktops` }),
            providesTags: ['Desktop'],
        }),
        desktop: builder.query<Desktop, number>({
            query: (desktopId) => ({
                url: 'desktop/' + desktopId,
            }),
            providesTags: ['Desktop'],
        }),
        createDesktop: builder.mutation<Desktop, CreateDesktop>({
            query: (body) => ({ url: 'desktop/create', method: 'POST', body }),
            invalidatesTags: ['Desktop', 'Members', 'Project'],
        }),
        deleteDesktop: builder.mutation<void, number>({
            query: (desktopId) => ({
                url: `desktop/${desktopId}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Desktop'],
        }),
        leaveDesktop: builder.mutation<void, LeaveDesktop>({
            query: ({ desktopId, ...body }) => ({
                url: `desktop/${desktopId}/leave`,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['Desktop'],
        }),
        updateDesktop: builder.mutation<void, EditDesktop>({
            query: (body) => ({ url: `desktop/${body.id}`, method: 'PUT', body }),
            invalidatesTags: ['Desktop'],
            async onQueryStarted({ id, ...newData }, { dispatch }) {
                dispatch(
                    extendedApi.util.updateQueryData('desktop', id, (oldData) => ({
                        ...oldData,
                        ...newData,
                    }))
                );
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useDesktopsQuery,
    useDesktopQuery,
    useCreateDesktopMutation,
    useUpdateDesktopMutation,
    useLeaveDesktopMutation,
    useDeleteDesktopMutation,
} = extendedApi;

// selectors
export const selectCurrentDesktop = (desktopId: number) =>
    extendedApi.useDesktopQuery(desktopId, {
        selectFromResult: ({ data }) => ({ desktop: data }),
    });
