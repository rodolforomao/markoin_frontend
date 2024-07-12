import { api } from '../../api/api';;
import type {
    DetailMovimentList,
} from '../apiTypes';

// Define a interface DetailMovimentListQuery
interface DetailMovimentListQuery {
    issueId: number;

}

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        detailMovimentList: builder.query<DetailMovimentList, DetailMovimentListQuery>({
            query: ({ issueId }) => ({
                url: `issue/${issueId}`,
            }),
            providesTags: ['DetailMovimentList'],
        }),
    }),
    overrideExisting: false,
});

// hooks
export const {
    useDetailMovimentListQuery,
} = extendedApi;

// selectors
interface DetailMovimentListSelector extends DetailMovimentListQuery { }

export const selectDetailMovimentList = (query: DetailMovimentListSelector) =>
    extendedApi.useDetailMovimentListQuery(query, {
        refetchOnMountOrArgChange: true,
    });
