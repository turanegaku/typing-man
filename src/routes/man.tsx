import type { Context } from 'hono';
import { manMap } from '../data/mans/index.js';
import type { RankRecord } from '../data/mans/types.js';
import { ManPage } from '../templates/manPage.js';

type Bindings = {
  TYPING_MAN_KV: KVNamespace;
  ASSETS: Fetcher;
};

const RANK_MAX = 10;
const KV_RANKING_KEY = (man: string) => `ranking:${man}`;

export async function manGetRoute(c: Context<{ Bindings: Bindings }>) {
  const command = c.req.param('man') ?? '';
  const entry = manMap.get(command);
  if (!entry) return c.notFound();

  const raw = await c.env.TYPING_MAN_KV.get(KV_RANKING_KEY(command));
  const ranks: RankRecord[] = raw ? JSON.parse(raw) : [];

  return c.html(
    <ManPage entry={entry} ranks={ranks} />,
  );
}

export async function manPostRoute(c: Context<{ Bindings: Bindings }>) {
  const command = c.req.param('man') ?? '';
  if (!manMap.has(command)) return c.notFound();

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.text('invalid', 400);
  }

  const { name, time, error, cpm, accuracy } = body;

  if (
    typeof name !== 'string' ||
    typeof time !== 'number' ||
    typeof error !== 'number' ||
    typeof cpm !== 'number' ||
    typeof accuracy !== 'number' ||
    name.length === 0 ||
    name.length > 12 ||
    time < 0 ||
    error < 0 ||
    cpm < 0 || cpm > 2500 ||
    accuracy < 0 || accuracy > 100
  ) {
    return c.text('invalid', 400);
  }

  const newRecord: RankRecord = {
    name: String(name),
    time: Math.round(time),
    error: Math.round(error),
    cpm: Math.round(cpm),
    accuracy: Math.round(accuracy * 10) / 10,
    date: Math.floor(Date.now() / 1000),
  };

  const raw = await c.env.TYPING_MAN_KV.get(KV_RANKING_KEY(command));
  const existing: RankRecord[] = raw ? JSON.parse(raw) : [];

  const updated = [...existing, newRecord]
    .sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      if (a.error !== b.error) return a.error - b.error;
      return b.date - a.date;
    })
    .slice(0, RANK_MAX);

  await c.env.TYPING_MAN_KV.put(KV_RANKING_KEY(command), JSON.stringify(updated));

  return c.text('ok');
}
