import TelegramBot from 'node-telegram-bot-api';

export function publishTaskMessage(bot: TelegramBot) {
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
