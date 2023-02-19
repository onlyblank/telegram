import { Bot } from 'grammy';
import { bot } from './bot';
import { isRegistered } from './cache';

import { authorize } from './request';
import { useConversations } from './scenarios';

function init() {
    return authorize()
        .then(() => bot);
}

init().then((bot) => {
    useConversations(bot);

    bot.command('start', async ctx => {
        const user = ctx.message.from.username;
        const registered = await isRegistered.get(user);

        await ctx.reply(`Registered: ${registered}`);

        if (registered) {
            await ctx.conversation.enter("loopConversation");
        }
        else {
            await ctx.conversation.enter("registrationConversation");
        }
    });

    bot.start({
        onStart(info) {
            console.log('Bot started', { info });
        },
    });
})
