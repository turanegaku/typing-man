import type { FC } from 'hono/jsx';

export const InfoSection: FC<{ children?: any }> = ({ children }) => (
  <>
    <div id="info">{children}</div>
    <hr />
  </>
);
