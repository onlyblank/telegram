import { Bot } from 'grammy';
import { bot } from './bot';
import { isRegistered } from './cache';

import { config } from './config';
import { authorize } from './request';

function init(): Promise<any> {
    return authorize().then(() => Promise.all([]));
}

function createScenarios(): Bot {
    bot.command('start', async ctx => {
        const user = ctx.message.from.username;

        const registered = await isRegistered.get(user);
        ctx.reply(`Registered: ${registered}`);
    });

    return bot;
}

init().then(() => {
    const bot = createScenarios();

    bot.start({
        onStart(info) {
            console.log('Bot started', { info });
        },
    });
})
