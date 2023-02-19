import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";

export async function loopConversation(conversation: Conversation<any>, ctx: Context) {

    const iteration = async (ctx: Context) => {
        await ctx.reply("Welcome to the endless loop");
        const ctx_new = await conversation.wait();
        return iteration(ctx_new);
    }

    await iteration(ctx);
}