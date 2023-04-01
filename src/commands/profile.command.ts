import { getUserCachedData } from "../queries/user";
import { Command } from "./types";

const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username;
    if(!username){
        return;
    }

    const user = await getUserCachedData(username);
    if(!user){
        return;
    }


    const rows = [
        `email: ${user.email ?? 'Не привязан'}`,
        `id: ${user.id}`,
    ];
    const message = rows.join('\n');

    return await ctx.reply(message);
}

export const profileCommand: Command = {
    command: 'profile',
    description: 'User profile',
    middleware,
}