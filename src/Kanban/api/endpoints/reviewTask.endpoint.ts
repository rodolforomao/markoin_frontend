// Importando os tipos e funções necessários
import { api } from '../../api/api';;
import type { ReviewTask } from '../apiTypes';

// Definindo a interface para a consulta de ReviewTask
interface ReviewTaskQuery {
    taskId: number;
}

// Estendendo a API com um novo endpoint para revisão de tarefas
export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        reviewTask: builder.query<ReviewTask, ReviewTaskQuery>({
            query: ({ taskId }) => ({
                url: `reviewTask/`,
            }),
            providesTags: ['ReviewTask'],
        }),
    }),
    overrideExisting: false,
});

// Exportando hooks para uso fácil
export const {
    useReviewTaskQuery,
} = extendedApi;

// Definindo um seletor para a revisão de tarefas
interface ReviewTaskSelector extends ReviewTaskQuery { }

export const selectReviewTask = (query: ReviewTaskSelector) =>
    extendedApi.useReviewTaskQuery(query, {
        refetchOnMountOrArgChange: true,
    });
