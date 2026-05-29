import type { ManEntry } from './types.js';

export const yes: ManEntry = {
  command: 'yes',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'yes -- be repetitively affirmative\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: "yes outputs expletive, or, by default, ``y'', forever.\n" },
  ],
};
