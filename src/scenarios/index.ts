import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";

import { loopConversation } from './loop';
import { slashStartConversation } from "./slashStart";
import { authenticationConversation } from "./useAuthentication";

export function useConversations(bot: Bot) {
    bot.use(createConversation(slashStartConversation));
    bot.use(createConversation(loopConversation));
    bot.use(createConversation(authenticationConversation));
}