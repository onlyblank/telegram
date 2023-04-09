import { Bot, InlineKeyboard } from "grammy";
import { GET } from "src/@types/resources";
import { enterTestSolution } from "../scenarios/testSolution";
import { MyContext } from "src/types";
import { getSolvableTests } from "../queries/test";
import { Command } from "./types";

function createKeyboard(tests: GET.ExtendedTestInformation[]): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    for(const test of tests) {
        keyboard.text(
            `${test.title} [${test.solvedTasksCount}/${test.tasksCount}]`,
            `tests/${test.id}/enter`
        ).row();
    }

    return keyboard;
}

const middleware: Command['middleware'] = async (ctx) => {
    const chatId = ctx.from?.id;

    const tests = chatId ? await getSolvableTests(chatId) : [];

    const message = tests.length !== 0 
        ? "Список доступных тестов:" 
        : "Нет доступных тестов";

    const options = tests.length !== 0 ? {
        reply_markup: createKeyboard(tests)
    } : undefined;

    return await ctx.reply(message, options);
};

const route = /^tests\/(\d+)\/enter$/;

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