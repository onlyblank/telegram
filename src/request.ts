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
                // Handle success.
                console.log('Well done!');
                console.log('User profile', response.data.user);
                console.log('User token', response.data.jwt);
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
    return `${config.API_URL}${url}`;
}

export function get<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.get<T, R, D>(prependApiUrl(url), mixHeaders(config))
        .catch(error => {
            console.error(`GET request failed: ${error}`);
            throw error;
        });
}

export function post<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.post<T, R, D>(prependApiUrl(url), data, mixHeaders(config))
        .catch(error => {
            console.error(`POST request failed: ${error}`);
            throw error;
        });
}
