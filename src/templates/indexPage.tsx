import type { FC } from 'hono/jsx';
import { Layout } from './layout.js';
import type { RankRecord } from '../data/mans/types.js';

type IndexPageProps = {
  mans: string[];
  bests: Map<string, RankRecord>;
};

export const IndexPage: FC<IndexPageProps> = ({ mans, bests }) => {
  return (
    <Layout
      title="typing-man"
      scripts={<script type="text/javascript" src="/javascripts/selection.js" />}
    >
      <div id="info">
        <p>問題を選択してね</p>
      </div>
      <hr />
      <div id="selection">
        {mans.map((man) => {
          const best = bests.get(man);
          return (
            <p class="inline-3">
              {best && (
                <span class="holder">
                  <span class="nt">{best.name}</span>
                  <span class="nt">{formatTime(best.time)}</span>
                </span>
              )}
              <a>{man}</a>
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
