import { Axios, AxiosResponse } from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import * as path from 'path';
import { parseCommand } from '../heplers';
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
    // Debug.
    bot.onText(
        /^\/debug/,
        withAdmin(msg => {
            bot.sendMessage(msg.chat.id, 'debug');
        })
    );

    // Send image test.
    bot.onText(
        /^\/error/,
        withAdmin(msg => {
            bot.sendPhoto(
                msg.chat.id,
                path.resolve(__dirname, '../assets/img/error.jpg')
            );
        })
    );

    // Publish task.
    const publishHandler = async (msg: TelegramBot.Message) => {
        const { args } = parseCommand(msg.text);
        const taskId = +args[0] || 1;

        let res: AxiosResponse<any, any>;
        try {
            res = await request.get(`/api/tasks/${taskId}`);
        } catch (e) {
            return bot.sendMessage(msg.chat.id, 'Task not found');
        }

        bot.sendMessage(msg.chat.id, 'task image', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Решить', callback_data: 'task_answer' }],
                ],
            },
        });
    };

    bot.onText(/^\/publish/, withAdmin(publishHandler));

    // Unbind course from chat.
    bot.onText(
        /^\/bind$/,
        withAdmin(async msg => {
            //cosnt res = await request.post('/api//unbind', {
        })
    );
}
