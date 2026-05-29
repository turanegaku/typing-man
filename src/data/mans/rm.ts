import type { ManEntry } from './types.js';

export const rm: ManEntry = {
  command: 'rm',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'rm, unlink -- remove directory entries\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The rm utility attempts to remove the non-directory type files specified \non the command line. If the permissions of the file do not permit writ-\ning, and the standard input device is a terminal, the user is prompted \n(on the standard error output) for confirmation.\n` },
  ],
};
