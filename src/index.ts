import { GrammyError, HttpError } from 'grammy';
import { createBot } from './bot';
import { registerCommands, useCommands } from './commands';

import { authorize } from './request';
import { useConversations } from './scenarios';
import { useAuthenticationBoundary } from './scenarios/useAuthentication';

const init = () => authorize().then(createBot).then(async bot => {
    await registerCommands(bot);
    return bot;
})

init().then((bot) => {
    useConversations(bot);

    useAuthenticationBoundary(bot);

    useCommands(bot);


    bot.start({
        onStart(info) {
            console.log('Bot started', { info });
        },
    });

    bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        } else {
            console.error("Unknown error:", e);
        }
    });
})
