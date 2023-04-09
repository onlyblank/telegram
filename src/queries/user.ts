import * as request from '../request';
import { GET, POST } from '../@types/resources';

export function getUser(chatId: number): Promise<GET.User | null> {
    return request
        .get<[] | [GET.User]>(`/users?filters[telegram_chat_id][$eq]=${chatId}`)
        .then(({ data }) => data.length === 0 ? null : data[0]);
}

type UserData = {
    id: number;
    email: string;
}

const usersCache = new Map<number, UserData>();

/**
 * Cached request
 */
export async function getUserCachedData(chatId: number): Promise<UserData | null> {
    let user = usersCache.get(chatId) ?? null;

    if(!user){
        user = await getUser(chatId);
        if(user){
            usersCache.set(chatId, {
                id: user.id,
                email: user.email
            });
        }
    }

    return user;
}

/**
 * Cached request
 */
export async function getUserId(chatId: number): Promise<number | null> {
    return getUserCachedData(chatId).then(user => user ? user.id : null);
}

/**
 * Cached request
 */
export async function getUserEmail(chatId: number): Promise<string | null> {
    return getUserCachedData(chatId).then(user => user ? user.email : null);
}

export function getUserByEmail(email: string): Promise<GET.User | null> {
    return request
        .get<[] | [GET.User]>(`/users?filters[email][$eq]=${email}`)
        .then(({ data }) => data.length === 0 ? null : data[0]);
}

function setUserTelegramChatId(userId: number, telegram_chat_id: number): Promise<GET.User> {
    return request.put<GET.User>(`/users/${userId}`, {
        telegram_chat_id
    }).then(({ data }) => data);
}

export function registerUser(username: string, email: string, password: string): Promise<GET.User>{
    return request.post<POST.RegisteredUserData>(`/auth/local/register`, {
        username,
        email,
        password,
    }).then(({ data }) => data.user);
}

export async function attachTelegramChatId(chatId: number, email: string): Promise<GET.User & { password?: string }> {
    let user: GET.User | null = await getUserByEmail(email);
    if(user?.telegram_chat_id){
        throw new Error(`Registered user with email ${email} already exists`);
    }
    
    let password: string | undefined;

    if(!user) {
        password = Math.random().toString(32).slice(2) + Math.random().toString(32).slice(2) + Math.random().toString(32).slice(2);
        user = await registerUser(chatId.toString(), email, password);
    }

    const updatedUser = await setUserTelegramChatId(user.id, chatId);

    return !password ? updatedUser : {
        ...updatedUser,
        password,
    };
}