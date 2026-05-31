import type { Context } from 'hono';
import { manMap, mans } from '../data/mans/index.js';
import type { RankRecord } from '../data/mans/types.js';
import { IndexPage } from '../templates/indexPage.js';
import { ManPage } from '../templates/manPage.js';

type Bindings = {
  TYPING_MAN_KV: KVNamespace;
  ASSETS: Fetcher;
};

const KV_RANKING_KEY = (man: string) => `ranking:${man}`;

export async function tutorialIndexRoute(c: Context<{ Bindings: Bindings }>) {
  const bestEntries = await Promise.all(
    mans.map(async (m) => {
      const raw = await c.env.TYPING_MAN_KV.get(KV_RANKING_KEY(m.command));
      if (!raw) return [m.command, null] as const;
      const records: RankRecord[] = JSON.parse(raw);
      return [m.command, records[0] ?? null] as const;
    }),
  );

  const bests = new Map<string, RankRecord>(bestEntries.filter((e): e is [string, RankRecord] => e[1] !== null));

  return c.html(<IndexPage mans={mans.map((m) => m.command)} bests={bests} tutorial={true} />);
}

export async function tutorialManRoute(c: Context<{ Bindings: Bindings }>) {
  const command = c.req.param('man') ?? '';
  const entry = manMap.get(command);
  if (!entry) return c.notFound();

  const raw = await c.env.TYPING_MAN_KV.get(KV_RANKING_KEY(command));
  const ranks: RankRecord[] = raw ? JSON.parse(raw) : [];

  return c.html(<ManPage entry={entry} ranks={ranks} tutorial={true} />);
}
