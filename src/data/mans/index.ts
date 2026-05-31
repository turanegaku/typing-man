import { a } from './a.js';
import { cat } from './cat.js';
import { chmod } from './chmod.js';
import { cp } from './cp.js';
import { curl } from './curl.js';
import { dd } from './dd.js';
import { echo } from './echo.js';
import { file } from './file.js';
import { grep } from './grep.js';
import { helloC } from './helloC.js';
import { jobs } from './jobs.js';
import { ls } from './ls.js';
import { mv } from './mv.js';
import { pwd } from './pwd.js';
import { rm } from './rm.js';
import { scp } from './scp.js';
import { ssh } from './ssh.js';
import { wget } from './wget.js';
import { yes } from './yes.js';
import { tar } from './tar.js';
import type { ManEntry } from './types.js';

// 新しいお題を追加する時は:
//   1. npm run add-man -- <コマンド名>  でファイルを自動生成
//   2. 生成された src/data/mans/<コマンド>.ts を確認・修正
//   3. 下の mans 配列に import して追加するだけ
export const mans: ManEntry[] = [
  a,
  cat,
  chmod,
  cp,
  curl,
  dd,
  echo,
  file,
  grep,
  helloC,
  jobs,
  ls,
  mv,
  pwd,
  rm,
  scp,
  ssh,
  wget,
  yes,
  tar,
];

export const manMap = new Map<string, ManEntry>(
  mans.map((m) => [m.command, m]),
);
