import { apiImr as api } from '../../api/api';
;

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        gerarRelatorioImr: builder.query({
            query: (mesReferente: string) => ({
                url: `relatorioImr/gerarRelatorioImr`,
                params: {
                    mesReferente: mesReferente
                }
            }),
        }),
        listEmployeeImr: builder.query({
            query: (mesReferente: string) => ({
                url: `relatorioImr/listEmployeeImr`,
                params: {
                    mesReferente: mesReferente
                }
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGerarRelatorioImrQuery, useListEmployeeImrQuery } = extendedApi;
