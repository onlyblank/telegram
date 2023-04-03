import { Bot, InlineKeyboard } from "grammy";
import { GET } from "src/@types/resources";
import { enterTestSolution } from "../scenarios/testSolution";
import { MyContext } from "src/types";
import { getAssignedTests } from "../queries/test";
import { Command } from "./types";

function createKeyboard(tests: GET.Test[]): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    for(const test of tests) {
        keyboard.text(test.title, `tests/enter/${test.id}`).row();
    }

    return keyboard;
}

const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username;

    const tests = username ? await getAssignedTests(username) : [];

    const message = tests.length !== 0 
        ? "Список доступных тестов:" 
        : "Нет доступных тестов";

    const options = tests.length !== 0 ? {
        reply_markup: createKeyboard(tests)
    } : undefined;

    return await ctx.reply(message, options);
};

const route = /^tests\/enter\/(\d+)$/;

const useTestEnterCallbackQuery = (bot: Bot<MyContext>) =>  {
    bot.callbackQuery(route, async (ctx) => {
        const taskId = +ctx.match[1];
        await Promise.all([
            ctx.answerCallbackQuery(),
            enterTestSolution(taskId, ctx)
        ]);
    });
}

export const assignmentsCommand: Command = {
    command: 'assignments',
    description: 'Lists all assignments',
    middleware,
    callbackQueryRegisterFunctions: [useTestEnterCallbackQuery],
};