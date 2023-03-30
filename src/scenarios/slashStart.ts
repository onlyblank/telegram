import { Conversation } from "@grammyjs/conversations";
import { MyContext } from "src/types";

export async function slashStartConversation(conversation: Conversation<any>, ctx: MyContext) {
    await ctx.reply("Привет. это команда /start");
}
