import { conversations } from '@grammyjs/conversations';
import { Bot, session } from 'grammy';
import { config } from './config';
import { MyContext } from './types';

export const bot = new Bot<MyContext>(config.TG_BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());