import * as request from '../request';
import { GET, POST } from '../@types/resources';

export function getUserByEmail(email: string): Promise<GET.User | null> {
    return request
        .get<[] | [GET.User]>(`/users?filters[email][$eq]=${email}`)
        .then(({ data }) => data.length === 0 ? null : data[0]);
}

export function getUserByTelegramUsername(username: string): Promise<GET.User | null> {
    return request
        .get<[] | [GET.User]>(`/users?filters[telegram_username][$eq]=${username}`)
        .then(({ data }) => data.length === 0 ? null : data[0]);
}

function setUserTelegramUsername(userId: number, telegram_username: string): Promise<GET.User> {
    return request.put<GET.User>(`/users/${userId}`, {
        telegram_username
    }).then(({ data }) => data);
}

export function registerUser(username: string, email: string, password: string): Promise<GET.User>{
    return request.post<POST.RegisteredUserData>(`/auth/local/register`, {
        username,
        email,
        password,
    }).then(({ data }) => data.user);
}

export async function attachTelegramUsername(username: string, email: string): Promise<GET.User & { password?: string }> {
    let user: GET.User | null = await getUserByEmail(email);
    if(user?.telegram_username){
        throw new Error(`Registered user with email ${email} already exists`);
    }
    
    let password: string | undefined;

    if(!user) {
        password = Math.random().toString(32).slice(2) + Math.random().toString(32).slice(2) + Math.random().toString(32).slice(2);
        user = await registerUser(username, email, password);
    }

    const updatedUser = await setUserTelegramUsername(user.id, username);

    return !password ? updatedUser : {
        ...updatedUser,
        password,
    };
}