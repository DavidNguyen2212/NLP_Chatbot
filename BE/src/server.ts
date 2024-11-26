import { App } from '@/app';
import { ChatRoute } from './routes/chats.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new ChatRoute()]);
app.listen();
