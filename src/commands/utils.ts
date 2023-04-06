import { InlineKeyboard } from "grammy";

export const withKeyboard = <TArgs extends any[]>(build: (keyboard: InlineKeyboard, ...rest: TArgs) => void) => {
    return (...rest: TArgs) => {
        const keyboard = new InlineKeyboard();
        build(keyboard, ...rest);
        return keyboard;
    };
}