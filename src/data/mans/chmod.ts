import type { ManEntry } from './types.js';

export const chmod: ManEntry = {
  command: 'chmod',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'chmod -- change file modes or Access Control Lists\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The chmod utility modifies the file mode bits of the listed files as \nspecified by the mode operand. It may also be used to modify the Access \nControl Lists (ACLs) associated with the listed files.\n` },
  ],
};
