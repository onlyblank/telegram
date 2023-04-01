import { Context, CommandMiddleware, CallbackQueryMiddleware, Bot } from "grammy";

export interface Command {
    command: string;
    description: string;
    middleware: CommandMiddleware<Context>;
    callbackQueryRegisterFunctions?: ((bot: Bot) => void)[];
}