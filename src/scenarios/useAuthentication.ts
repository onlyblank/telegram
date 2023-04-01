import { Conversation, createConversation } from "@grammyjs/conversations";
import { Bot, NextFunction } from "grammy";
import { attachTelegramUsername, getUserByEmail, getUserCachedData } from "../queries/user";
import { MyContext } from "../types";
import { ConversationError } from "./conversationError";

/**
 * Checks if user with `username` can make authenticated requests.
 * @param username 
 * @returns 
 */
const isAuthenticated = (username: string) => getUserCachedData(username).then(Boolean);

const isEmailLinked = (email: string) => getUserByEmail(email).then(user => Boolean(user?.telegram_username));

const BASE_MESSAGE = "Чтобы зарегистрироваться, введите свой email, заканчивающийся на @hse.ru или @edu.hse.ru";

const isEmailCorrect = (email: string): boolean => {
    return /^\w+@(edu)?\.hse\.ru$/.test(email);
}

async function authentication(
    ctx: MyContext,
    next: NextFunction
): Promise<void> {
    const isMessage = Boolean(ctx.update.message);
    if(!isMessage){
        return await next();
    }

    const username = ctx.from?.username;

    if(!username || await isAuthenticated(username)){
        return await next();
    }

    await ctx.conversation.enter("authenticationConversation");
    return await next();
}

async function waitForValidEmail(conversation: Conversation<any>): Promise<string> {
    const context = await conversation.waitFor(":text");
    const email = context.msg.text;

    if ( !isEmailCorrect(email) ) {
        throw new ConversationError("Введеная строка не является адресом электронной почты.");
    }

    const isEmailTaken = await conversation.external(() => isEmailLinked(email));
    if( isEmailTaken ) {
        throw new ConversationError("Введенный email уже используется.");
    }

    return email;
}

export async function authenticationConversation(conversation: Conversation<any>, ctx: MyContext) {
    let email: string = "";

    while(email === ""){
        await ctx.reply(BASE_MESSAGE);
        try {
            email = await waitForValidEmail(conversation);
        }
        catch (error) {
            if (error instanceof ConversationError){
                await ctx.reply(error.message);
            }
            else {
                throw error;
            }
        }
    }
    
    try {
        const username = ctx.from?.username;
        const user = await conversation.external(() => attachTelegramUsername(username!, email));
        await ctx.reply(`Пользователь ${username} ${email} Зарегистрирован`);
        if(user.password){
            await ctx.reply(`Ваш пароль: ||${user.password}||`, {
                parse_mode: 'MarkdownV2'
            });
        }
    }
    catch (error) {
        await ctx.reply("Неизвестная ошибка. Попробуйте позже.");
        // Dont throw to keep user inside conversation.
        console.error(error)
    }
}

export const useAuthenticationBoundary = (bot: Bot) => {
    bot.use(authentication);
};