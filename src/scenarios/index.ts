import { createConversation } from "@grammyjs/conversations";
import { Bot } from "grammy";

import { registrationConversation } from './registration';
import { loopConversation } from './loop';

export function useConversations(bot: Bot) {
    bot.use(createConversation(registrationConversation));
    bot.use(createConversation(loopConversation));
}