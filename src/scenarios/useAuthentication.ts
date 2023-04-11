import { Conversation, createConversation } from "@grammyjs/conversations";
import { Bot, NextFunction } from "grammy";
import { attachTelegramChatId, getUserByEmail, getUserCachedData } from "../queries/user";
import { MyContext } from "../types";
import { ConversationError } from "./conversationError";

/**
 * Checks if user with `username` can make authenticated requests.
 * @param chatId 
 * @returns 
 */
const isAuthenticated = (chatId: number) => getUserCachedData(chatId).then(Boolean);

const isEmailLinked = (email: string) => getUserByEmail(email).then(user => Boolean(user?.telegram_chat_id));

const BASE_MESSAGE = "Чтобы зарегистрироваться, введите свой email, заканчивающийся на @hse.ru или @edu.hse.ru";

const isEmailCorrect = (email: string): boolean => {
    return /^\w+@(edu\.)?hse\.ru$/.test(email);
}

async function authentication(
    ctx: MyContext,
    next: NextFunction
): Promise<void> {
    const isMessage = Boolean(ctx.update.message);
    if(!isMessage){
        return await next();
    }

    const chatId = ctx.from?.id!;

    if(!chatId || await isAuthenticated(chatId)){
        return await next();
    }

    await ctx.conversation.enter("authenticationConversation");
}

async function waitForValidEmail(conversation: Conversation<any>): Promise<string> {
    const context = await conversation.waitFor(":text");
    const email = context.msg.text;

    if ( !isEmailCorrect(email) ) {
        throw new ConversationError("Введенная строка не является адресом электронной почты.");
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
        const chatId = ctx.from?.id!;
        const user = await conversation.external(() => attachTelegramChatId(chatId, email));
        await ctx.reply(`Пользователь ${chatId} ${email} Зарегистрирован`);
        if(user.password){
            await ctx.reply(`Ваш пароль: ||${user.password}||`, {
                parse_mode: 'MarkdownV2'
            });
        }
    }
    catch (error) {
        await ctx.reply("Неизвестная ошибка. Попробуйте позже.");
        // Dont throw to keep user inside conversation.
        await conversation.external(() => console.error(error));
    }
}

export const useAuthenticationBoundary = (bot: Bot) => {
    bot.use(createConversation(authenticationConversation));
    bot.use(authentication);
};