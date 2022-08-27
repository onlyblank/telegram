import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';

const mixedHeaders = {
    Authorization: `Bearer ${config.API_TOKEN}`,
};

function mixHeaders(config?: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
    config ??= {};
    config.headers ??= {};
    config.headers = { ...mixedHeaders, ...config.headers };
    return config;
}

function prependApiUrl(url: string): string {
    return `${config.API_URL}${url}`;
}

export function get<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.get<T, R, D>(prependApiUrl(url), mixHeaders(config));
}

export function post<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    return axios.post<T, R, D>(prependApiUrl(url), data, mixHeaders(config));
}
