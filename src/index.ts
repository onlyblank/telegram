import { bot } from './bot';
import { adminScenario } from './scenarios/admin';
import { publishTaskMessage } from './scenarios/publishTaskMessage';

publishTaskMessage(bot);
adminScenario(bot);
