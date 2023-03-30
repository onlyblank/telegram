import { Command } from "./types";

export const startCommand: Command = {
    command: "start",
    description: "start",
    middleware: async ctx => {
        await ctx.reply(`Привет, ${ctx.from?.first_name}`);
    }
}