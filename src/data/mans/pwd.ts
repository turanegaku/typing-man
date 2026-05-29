import type { ManEntry } from './types.js';

export const pwd: ManEntry = {
  command: 'pwd',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'pwd -- return working directory name\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The pwd utility writes the absolute pathname of the current working \ndirectory to the standard output.\n` },
    { kind: 'dd', text: `Some shells may provide a builtin pwd command which is similar or identi-\ncal to this utility. Consult the builtin(1) manual page.\n` },
  ],
};
