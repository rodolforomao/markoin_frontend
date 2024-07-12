import { api } from '../../api/api';;
import type {
    ListActivity,
} from '../apiTypes';

// Defina a interface ListActivityQuery
interface ListActivityQuery {
    projectId: number;
}

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        listActivity: builder.query<ListActivity[], ListActivityQuery>({
            query: ({ projectId }) => ({
                url: `project/${projectId}/listActivity}`,
            }),
            providesTags: ['ListActivity'],
        }),
    }),
    overrideExisting: false,
});

// Hooks
export const {
    useListActivityQuery,
} = extendedApi;

// Selectors
interface ListActivitySelector extends ListActivityQuery {
    listId: number;
}

export const selectListActivityArray = ({ listId, ...query }: ListActivitySelector) =>
    extendedApi.useListActivityQuery(query, {
        selectFromResult: ({ data }) => ({
            listActivity: data ? data[listId] : [],
        }),
        refetchOnMountOrArgChange: true,
    });
