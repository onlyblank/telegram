import { conversations } from '@grammyjs/conversations';
import { Bot, session } from 'grammy';
import { config } from './config';
import { MyContext } from './types';

const createInitialSession = () => ({
    currentTestId: null,
})

export const createBot = () => {
    const bot = new Bot<MyContext>(config.TG_BOT_TOKEN);

    bot.use(session({ 
        initial: createInitialSession,
    }));
    bot.use(conversations());

    return bot;
};
