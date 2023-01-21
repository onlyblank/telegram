import { load } from 'ts-dotenv';

process.env.API_URL = 'http://cms:1337/api';

export const config = load({
    PORT: Number,
    TG_BOT_TOKEN: String,

    API_URL: String,
    STRAPI_IDENTIFIER: String,
    STRAPI_PASSWORD: String,
});
