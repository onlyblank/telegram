import * as request from './request';
import { CMS } from './resources/resources';

export const isRegistered = (() => {
    const cache = new Set<string>();

    return {
        async get(username: string): Promise<boolean> {
            if (!username) {
                return false;
            }
            if (caches.has(username)) {
                return true;
            }

            return request.get<[] | [CMS.User]>(`/users?filters[tg_username][$eq]=${username}`).then(({ data }) => {
                const isRegistered = Boolean(data[0]);
                if (isRegistered) {
                    cache.add(username);
                }

                return isRegistered;
            }).catch(() => false);
        },

        async set(nickname: string, value: boolean): Promise<void> {
            // TODO
        }
    }
})();
