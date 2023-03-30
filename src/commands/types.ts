import { Context, CommandMiddleware } from "grammy";

export interface Command {
    command: string;
    description: string;
    middleware: CommandMiddleware<Context>;
}