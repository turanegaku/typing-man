import type { FC } from 'hono/jsx';
import { Layout } from './layout.js';
import type { RankRecord } from '../data/mans/types.js';

type ManItem = { command: string; displayName?: string };

type IndexPageProps = {
  mans: ManItem[];
  bests: Map<string, RankRecord>;
  tutorial?: boolean;
};

export const IndexPage: FC<IndexPageProps> = ({ mans, bests, tutorial }) => {
  return (
    <Layout
      title="typing-man"
      scripts={<script type="text/javascript" src="/javascripts/selection.js" />}
    >
      <div id="info">
        <p>問題を選択してね</p>
      </div>
      <hr />
      <div id="selection" data-tutorial={tutorial ? 'true' : undefined}>
        {mans.map(({ command, displayName }) => {
          const label = displayName || command;
          const best = bests.get(command);
          return (
            <p class="inline-3">
              {best && (
                <span class="holder">
                  <span class="nt">{best.name}</span>
                  <span class="nt">{formatTime(best.time)}</span>
                </span>
              )}
              <a data-command={command}>{label}</a>
            </p>
          );
        })}
      </div>
    </Layout>
  );
};

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
