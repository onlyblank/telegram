import TelegramBot from 'node-telegram-bot-api';

export function publishTaskMessage(bot: TelegramBot) {
    const handler = msg => {
        bot.sendMessage(msg.chat.id, 'task image', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Решить', callback_data: 'task_answer' }],
                ],
            },
        });
    };
    bot.on('message', handler);
    bot.on('channel_post', handler);

    bot.on('callback_query', async query => {
        if (query.data !== 'task_answer') return;

        bot.answerCallbackQuery(query.id, {
            text: 'Отправил задание в лс',
        });

        await bot.sendMessage(
            query.from.id,
            'Вопрос от бота. На размышление 30 секунд'
        );

        bot.forwardMessage(
            query.from.id,
            query.message.chat.id,
            query.message.message_id
        );
    });
}
