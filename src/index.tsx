import { Hono } from 'hono';
import { indexRoute } from './routes/index.js';
import { manGetRoute, manPostRoute } from './routes/man.js';
import { tutorialIndexRoute, tutorialManRoute } from './routes/tutorial.js';
import { userRoute } from './routes/user.js';

type Bindings = {
  TYPING_MAN_KV: KVNamespace;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', indexRoute);
app.get('/tutorial', tutorialIndexRoute);
app.get('/tutorial/:man', tutorialManRoute);
app.get('/user/:username', userRoute);   // /user/:username より前に定義
app.get('/:man', manGetRoute);
app.post('/:man', manPostRoute);

// 上記ルートにマッチしなかった静的ファイルは ASSETS (./public) から配信
app.use('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
