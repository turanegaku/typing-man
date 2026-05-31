import type { FC } from 'hono/jsx';
import { Layout } from './layout.js';
import type { ManEntry, ManLine, RankRecord } from '../data/mans/types.js';

const RANK_MAX = 10;

type ManPageProps = {
  entry: ManEntry;
  ranks: RankRecord[];
};

const ManLineEl: FC<{ line: ManLine }> = ({ line }) => {
  switch (line.kind) {
    case 'dt':
      return <dt>{line.text}</dt>;
    case 'dd':
      return <dd>{line.text}</dd>;
    case 'dd-tab':
      return <dd class="tab">{line.text}</dd>;
    case 'dd-skip':
      return (
        <dd>
          <span class="skip"> </span>
        </dd>
      );
    case 'dd-blank':
      return <dd class="blank"><span class="enter"> </span></dd>;
  }
};

function formatTimer(ms: number): string {
  const total = Math.floor(ms / 10);
  const centisecs = total % 100;
  const seconds = Math.floor(total / 100) % 60;
  const minutes = Math.floor(total / 6000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centisecs).padStart(2, '0')}`;
}

const NO_DATA_TIME = 30 * 60 * 1000;

export const ManPage: FC<ManPageProps> = ({ entry, ranks }) => {
  // RANK_MAX 件に満たない場合は NoData で埋める
  const filledRanks: RankRecord[] = [...ranks];
  while (filledRanks.length < RANK_MAX) {
    filledRanks.push({ name: 'NoData', time: NO_DATA_TIME, error: 0, cpm: 0, accuracy: 0, date: 0 });
  }

  return (
    <Layout
      title="typing-man"
      scripts={<script type="text/javascript" src="/javascripts/typing.js" />}
    >
      <div id="info">
        <div id="error" class="inline-3">
          <dl>
            <dt><h3>ERROR</h3></dt>
            <dd class="value">0</dd>
          </dl>
        </div>
        <div id="time" class="inline-3">
          <dl>
            <dt><h3>Time</h3></dt>
            <dd class="value">00:00.00</dd>
          </dl>
        </div>
        <div id="cpm" class="inline-3">
          <dl>
            <dt><h3>CPM</h3></dt>
            <dd class="value">---</dd>
          </dl>
        </div>
        <div id="accuracy" class="inline-3">
          <dl>
            <dt><h3>Acc</h3></dt>
            <dd class="value">---%</dd>
          </dl>
        </div>
        <div class="inline-3">
          <p><span class="enter">NewLine(Enter)</span></p>
          <p><span class="delete">Delete(BS)</span></p>
        </div>
        <p class="inline-3">キー入力と同時にスタートします</p>
      </div>
      <hr />

      <div id="question" data-command={entry.command}>
        <dl>
          {entry.lines.map((line, i) => (
            <ManLineEl key={i} line={line} />
          ))}
        </dl>
      </div>

      <div id="option">
        <button id="review" class="default">今のを再生</button>
        <button id="restart" class="default">はじめから</button>
      </div>

      <div id="rank">
        <h3>ランキング</h3>
        <ol style="font-size: 2vw;">
          {filledRanks.map((rank, i) => (
            <li key={i}>
              <div class="inline-2 name">{rank.name}</div>
              <div class="inline-2 time" t={String(rank.time)}>{formatTimer(rank.time)}</div>
              <div class="inline-1 error">{rank.error} err</div>
              <div class="inline-2 cpm">{rank.cpm ? `${rank.cpm} CPM` : '---'}</div>
            </li>
          ))}
        </ol>
      </div>

      <div id="drop" />
      <div id="miss" />
    </Layout>
  );
};
