import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';
import { withRetries } from './utils';

let STRAPI_JWT: string | undefined = undefined;

export const authorize = withRetries(
    () =>
        post('/auth/local', {
            identifier: config.STRAPI_IDENTIFIER,
            password: config.STRAPI_PASSWORD,
        })
            .then(response => {
                console.log('Logged in as', response.data.user);
                STRAPI_JWT = response.data.jwt;
            }),
    3
);

function mixHeaders(config?: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
    const additionalHeaders = {
        "Content-Type": "application/json",
    }
    if (STRAPI_JWT) {
        additionalHeaders["Authorization"] = `Bearer ${STRAPI_JWT}`;
    }

    return {
        ...config,
        headers: {
            ...additionalHeaders,
            ...config?.headers
        }
    }
}

function prependApiUrl(url: string): string {
    return `${config.API_ENDPOINT}${url}`;
}

type Method = 'GET' | 'POST' | 'PUT';

const handleError = (method: Method, url: string) => (error) => {
    console.error(`${method} request failed: ${error}`);
    console.error(url);
    throw error;
}

export function get<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.get<T, R, D>(prependApiUrl(url), mixHeaders(config))
        .catch(handleError('GET', url));
}

export function post<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.post<T, R, D>(prependApiUrl(url), data, mixHeaders(config))
        .catch(handleError('POST', url));
}

export function put<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.put<T, R, D>(prependApiUrl(url), data, mixHeaders(config))
        .catch(handleError('PUT', url)); 
}