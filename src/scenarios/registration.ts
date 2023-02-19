import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";
import { GET, POST } from "src/resources/resources";
import * as request from "../request";
import { MyContext } from "../types";

const isEmailCorrect = (email: string): boolean => {
    return /^\w+@(edu)?\.hse\.ru$/.test(email);
}

async function isEmailAlreadyRegistered(email: string): Promise<boolean> {
    return request.get<GET.User[]>(`/users?filters[email][$eq]=${email}`)
        .then(response => response.data.length !== 0)
        .catch(() => true);
}

async function createUser(username: string, email: string): Promise<POST.User> {
    return request.post<POST.User, any, POST.User>('/users', {
        username,
        email
    })
}

const BASE_MESSAGE = "Чтобы зарегистрироваться, введите свой email, заканчивающийся на @hse.ru или @edu.hse.ru";

const build_message = (error: string | "") => [error, BASE_MESSAGE].filter(Boolean).join('\n');

export async function registrationConversation(conversation: Conversation<any>, ctx: Context) {
    let emailContext: MyContext = undefined;
    let error_message: string | "" = "";
    const username = ctx.from.username;

    while (true) {
        await ctx.reply(build_message(error_message));

        emailContext = await conversation.waitFor(":text");
        const email = emailContext.msg.text

        if (!isEmailCorrect(email)) {
            error_message = "Введеная строка не является адресом электронной почты.";
            continue;
        }

        const isEmailRegistered = await isEmailAlreadyRegistered(email);
        if (isEmailRegistered) {
            error_message = "Введенный email уже используется.";
            continue;
        }

        // Сохраняем.
        try {
            createUser(username, email);
        }
        catch {
            error_message = "Неизвестная ошибка. Попробуйте позже.";
            continue;
        }

        await emailContext.reply(`Пользователь ${username} ${email} Зарегистрирован`);

        break;
    }


}