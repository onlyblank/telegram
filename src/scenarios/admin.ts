import TelegramBot from 'node-telegram-bot-api';

const adminUsernames = ['doritosxxx'];

function isAdmin(username: string) {
    return adminUsernames.includes(username);
}

export function admin(bot: TelegramBot) {
    /*
    bot.on("", msg => {
        console.log(msg.from.username);
        if (!isAdmin(msg.from.username)) return;
        bot.sendMessage(985597814, 'debug');
    });*/
}
