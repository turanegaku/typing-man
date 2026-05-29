import type { FC } from 'hono/jsx';
import { Layout } from './layout.js';
import { mans } from '../data/mans/index.js';

type UserPageProps = { username: string };

export const UserPage: FC<UserPageProps> = ({ username }) => (
  <Layout
    title="typing-man"
    scripts={
      <script
        type="text/javascript"
        src="/javascripts/userpage.js"
        data-username={username}
      />
    }
  >
    <div
      id="user-stats"
      data-mans={JSON.stringify(mans.map((m) => m.command))}
    >
      <p>データを読み込み中...</p>
    </div>
  </Layout>
);
