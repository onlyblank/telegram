import TelegramBot from 'node-telegram-bot-api';

const adminUsernames = ['doritosxxx'];

function isAdmin(username: string) {
    return adminUsernames.includes(username);
}

function withAdmin<T>(
    callback: (msg: TelegramBot.Message) => Promise<T> | T
): (msg: TelegramBot.Message) => Promise<T> {
    return async msg => {
        if (!isAdmin(msg.from.username)) {
            return;
        }
        console.log(msg.from.username);
        return await callback(msg);
    };
}

export function adminScenario(bot: TelegramBot) {
    bot.onText(
        /^\/debug/,
        withAdmin(msg => {
            bot.sendMessage(msg.chat.id, 'debug');
        })
    );

    const publishHandler = msg => {
        bot.sendMessage(msg.chat.id, 'task image', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Решить', callback_data: 'task_answer' }],
                ],
            },
        });
        bot.on('message', publishHandler);
        bot.on('channel_post', publishHandler);
    };

    bot.onText(/^\/publish/, withAdmin(publishHandler));
}
