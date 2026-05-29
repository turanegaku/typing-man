import type { Context } from 'hono';
import { mans } from '../data/mans/index.js';
import type { RankRecord } from '../data/mans/types.js';
import { IndexPage } from '../templates/indexPage.js';

type Bindings = {
  TYPING_MAN_KV: KVNamespace;
  ASSETS: Fetcher;
};

export async function indexRoute(c: Context<{ Bindings: Bindings }>) {
  // 全コマンドの最優秀記録を並列取得
  const bestEntries = await Promise.all(
    mans.map(async (m) => {
      const raw = await c.env.TYPING_MAN_KV.get(`ranking:${m.command}`);
      if (!raw) return [m.command, null] as const;
      const records: RankRecord[] = JSON.parse(raw);
      return [m.command, records[0] ?? null] as const;
    }),
  );

  const bests = new Map<string, RankRecord>(
    bestEntries
      .filter((e): e is [string, RankRecord] => e[1] !== null)
  );

  return c.html(
    <IndexPage
      mans={mans.map((m) => m.command)}
      bests={bests}
    />,
  );
}
