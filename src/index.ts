import { bot } from './bot';

import { authorize } from './request';
import { useConversations } from './scenarios';
import { useAuthenticationBoundary } from './scenarios/useAuthentication';

function init() {
    return authorize()
        .then(() => bot);
}

init().then((bot) => {

    // useStartCommand(bot);
    useConversations(bot);

    useAuthenticationBoundary(bot);

    bot.command('start', async ctx => {
        // const user = ctx.message.from.username;
        await ctx.reply(`Привет, ${ctx.from?.first_name}`);
        // const registered = await isRegistered.get(user);

        // await ctx.reply(`Registered: ${registered}`);

        // if (registered) {
        //     await ctx.conversation.enter("loopConversation");
        // }
        // else {
        //     await ctx.conversation.enter("registrationConversation");
        // }
    });



    bot.start({
        onStart(info) {
            console.log('Bot started', { info });
        },
    });
})
