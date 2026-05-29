import type { Context } from 'hono';
import { UserPage } from '../templates/userPage.js';

type Bindings = { TYPING_MAN_KV: KVNamespace; ASSETS: Fetcher };

export async function userRoute(c: Context<{ Bindings: Bindings }>) {
  const username = c.req.param('username') ?? '';
  return c.html(<UserPage username={username} />);
}
