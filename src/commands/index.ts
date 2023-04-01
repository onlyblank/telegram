import { Bot } from "grammy";
import { assignmentsCommand } from "./assignments.command";
import { coursesCommand } from "./courses.command";
import { profileCommand } from "./profile.command";
import { startCommand } from "./start.command";
import { Command } from "./types";

const commands: Command[] = [ 
    startCommand,
    coursesCommand,
    profileCommand,
    assignmentsCommand,
]; 

export const useCommands = (bot: Bot) => {
    for (const command of commands) {
        bot.command(command.command, command.middleware);
    }
}

export const registerCommands = (bot: Bot) => bot.api.setMyCommands(commands.map(({ command, description }) => ({ command, description })));

export const useCallbackQueries = (bot: Bot) => {
    const registerFunctions = commands
        .filter(command => command.callbackQueryRegisterFunctions)
        .flatMap(({ callbackQueryRegisterFunctions }) => callbackQueryRegisterFunctions);

    for(const registerFunction of registerFunctions){
        if(registerFunction) {
            registerFunction(bot);
        }
    }

    bot.on("callback_query:data", async (ctx) => {
        await ctx.answerCallbackQuery();
        throw new Error("Unknown button event with payload: " +ctx.callbackQuery.data);
    });
}