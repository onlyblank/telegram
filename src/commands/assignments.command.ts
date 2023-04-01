import { getAssignedTests } from "../queries/test";
import { Command } from "./types";

const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username;

    const tests = await getAssignedTests(username!);

    const message = tests.length 
        ? tests.map(({ title }, i) => `${i + 1}) ${title}`).join('\n')
        : "Нет назначенных тестов";

    return await ctx.reply(message);
}

export const assignmentsCommand: Command = {
    command: 'assignments',
    description: 'Lists all assignments',
    middleware,
}