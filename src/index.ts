// import { bot } from './bot';
// import { adminScenario } from './scenarios/admin';
// import { publishTaskMessage } from './scenarios/publishTaskMessage';

// publishTaskMessage(bot);
// adminScenario(bot);

import { config } from './config';
import * as webshot from './webshot';

webshot
    .createScreenshot({
        url: config.FRONTEND_URL + '/tasks/' + 1,
    })
    .then(res => {
        console.log(res.data);
    });
