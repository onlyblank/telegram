import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';

interface WebshotRequestConfig {
    url: string;
    clipSelector?: string;
    waitForEvent?: string;
}

function prependApiUrl(endpoint) {
    return `${'https://noon-river-perigee.glitch.me'}${endpoint}`;
    return `${config.WEBSHOT_URL}${endpoint}`;
}

export function createScreenshot(
    config: WebshotRequestConfig
): Promise<AxiosResponse<any, any>> {
    return axios.post(prependApiUrl('/screenshot'), config);
}
