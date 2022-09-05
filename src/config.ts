import * as dotenv from 'dotenv';

dotenv.config();

const types = {
    TOKEN: ['string'],
    HEROKU_APP_ID: ['string', 'undefined'],
    PORT: ['number', 'undefined'],
    APP_URL: ['string', 'undefined'],
    API_URL: ['string'],
    API_TOKEN: ['string'],
    WEBSHOT_URL: ['string'],
    FRONTEND_URL: ['string'],
} as const;

interface Config extends Partial<Record<keyof typeof types, any>> {
    TOKEN: string;
    HEROKU_APP_ID?: boolean;
    PORT?: number;
    APP_URL?: string;
    API_URL: string;
    API_TOKEN: string;
    WEBSHOT_URL: string;
    FRONTEND_URL: string;
}

/*
const notDefined = [];
for (const [key, values] of Object.entries(types)) {
    if (!values.some(value => value === typeof key)) {
        notDefined.push(key);
    }
}

if (notDefined.length) {
    for (const key of notDefined) {
        console.error(`${key} is not compatible with ${types[key].join('|')}`);
    }
    throw new Error('Config is not complete');
}
*/

const allowedKeys = Object.keys(types);
export const config: Config = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => allowedKeys.includes(key))
) as unknown as Config;

config.APP_URL = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
