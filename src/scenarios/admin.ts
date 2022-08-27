import TelegramBot from 'node-telegram-bot-api';
import * as path from 'path';
import * as request from '../request';

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

    bot.onText(
        /^\/error/,
        withAdmin(msg => {
            bot.sendPhoto(
                msg.chat.id,
                path.resolve(__dirname, '../assets/img/error.jpg')
            );
        })
    );

    const publishHandler = async (msg: TelegramBot.Message) => {
        const res = await request.get('/api/tasks/1');
        console.log(res.data);

        bot.sendMessage(msg.chat.id, 'task image', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Решить', callback_data: 'task_answer' }],
                ],
            },
        });
    };

    bot.onText(/^\/publish/, withAdmin(publishHandler));
}
