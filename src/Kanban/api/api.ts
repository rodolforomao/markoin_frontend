import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../../config/config';
import {tagTypes} from './types/tagTypes';

const base_url_backend = config.ip + ':' + config.port_backend

export const api = createApi({
	reducerPath: 'simApiReducer',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://' + base_url_backend + '/api/',
		credentials: 'include',
	}),
	tagTypes: tagTypes,
	endpoints: (builder) => ({}),
})

export const { } = api
