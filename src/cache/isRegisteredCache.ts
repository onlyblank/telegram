
import { getUserByTelegramUsername } from '../queries/user';

type Username = string;
type Email = string;

// Has `telegram_username` => has `email`
// Has `email` => might not have `telegram_username` 
const cache = new Map<Username, Email>();

export const userEmail = {
    /**
     * @param username Telegram username.
     * @returns string if user registered 
     * undefined if user is not registered
     */
    async get(username: Username): Promise<Email | undefined> {
        if (!username) {
            return undefined;
        }

        const email = cache.get(username);

        if(email){
            return email;
        }

        const user = await getUserByTelegramUsername(username);
        if(user && user.email){
            cache.set(username, user.email);
            return user.email;
        }

        return undefined;
    },
};

