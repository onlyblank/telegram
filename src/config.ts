import { load } from 'ts-dotenv';

export const config = load({
    PORT: Number,
    TG_BOT_TOKEN: String,

    API_ENDPOINT: String,
    STRAPI_IDENTIFIER: String,
    STRAPI_PASSWORD: String,
});
