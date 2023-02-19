import * as request from '../request';
import { GET } from '../resources/resources';

const cache = new Set<string>();

export const isRegistered = {
    async get(username: string): Promise<boolean> {
        if (!username) {
            return false;
        }
        if (cache.has(username)) {
            return true;
        }

        return request.get<[] | [GET.User]>(`/users?filters[username][$eq]=${username}`).then(({ data }) => {
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
};

