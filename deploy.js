const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

if (!shell.which('heroku')) {
    shell.echo('Sorry, this script requires heroku');
    shell.exit(1);
}

function loadEnv(env) {
    const lines = fs
        .readFileSync(path.resolve(__dirname, './.env'))
        .toString()
        .split(/\r?\n/);

    const vars = lines.filter(Boolean);

    // TODO: exclude vars that are already set.
    const local = vars.map(line => line.split('='));
    return { ...Object.fromEntries(local), ...env };
}

module.exports = config => {
    const env = loadEnv(config.env);
    const APP_NAME = env.TELEGRAM_APP_NAME;

    shell.cd(__dirname);
    const vars = ['TOKEN', 'API_URL', 'API_TOKEN'];
    for (const name of vars) {
        const result = shell.exec(`heroku config:get ${name} -a ${APP_NAME}`);
        if (result.code === 0 && result.stdout.trim() !== env[name]) {
            shell.exec(`heroku config:set ${name}=${env[name]} -a ${APP_NAME}`);
        }
    }
};
