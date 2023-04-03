import { Conversation } from "@grammyjs/conversations";
import { getUnsolvedTasks } from "../queries/tasks";
import { getUserId } from "../queries/user";
import { MyContext } from "../types";

export async function testSolutionConversation(conversation: Conversation<any>, ctx: MyContext) {
    const username = ctx.from?.username;
    const testId = await conversation.external(() => ctx.session.currentTestId);
    if(!username || testId === null){
        return;
    }

    const userId = await conversation.external(() => getUserId(username)) as number;

    const tasks = await conversation.external(() => getUnsolvedTasks(testId, userId))
    await ctx.reply(`Current testid: ${testId}`);
    await ctx.reply(JSON.stringify(tasks));
    
    await conversation.external(() => ctx.session.currentTestId = null);
}

export async function enterTestSolution(testId: number, ctx: MyContext) {
    ctx.session.currentTestId = testId;

    return await ctx.conversation.enter('testSolutionConversation');
}