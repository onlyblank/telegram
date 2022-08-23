import * as TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

function getOptions() {
    const isHeroku = !!config.HEROKU;

    if (!isHeroku) {
        return {
            polling: true,
        };
    }

    if (!config.PORT) {
        throw new Error('PORT is not defined');
    }
    if (!config.APP_URL) {
        throw new Error('APP_URL is not defined');
    }

    return {
        webHook: {
            port: config.PORT,
        },
    };
}

export const bot = new TelegramBot(config.TOKEN, getOptions());
if (config.HEROKU) {
    bot.setWebHook(`${config.APP_URL}/bot${config.TOKEN}`);
}
