import { InlineKeyboard } from "grammy";
import { GET } from "src/@types/resources";
import { getAssignedTests } from "../queries/test";
import { Command } from "./types";

function createKeyboard(tests: GET.Test[]): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    for(const test of tests) {
        keyboard.text(test.title).row();
    }

    return keyboard;
}


const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username;

    const tests = await getAssignedTests(username!);

    const message = tests.length !== 0 
        ? "Список доступных тестов:" 
        : "Нет доступных тестов";

    const options = tests.length !== 0 ? {
        reply_markup: createKeyboard(tests)
    } : undefined;

    return await ctx.reply(message, options);
}

export const assignmentsCommand: Command = {
    command: 'assignments',
    description: 'Lists all assignments',
    middleware,
}