import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

export const bot = new TelegramBot(process.env.TOKEN, { polling: true });
