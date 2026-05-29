import type { ManEntry } from './types.js';

export const dd: ManEntry = {
  command: 'dd',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'dd -- convert and copy a file\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The dd utility copies the standard input to the standard output. Input \ndata is read and written in 512-byte blocks. If input reads are short, \ninput from multiple reads are aggregated to form the output block. When \nfinished, dd displays the number of complete and partial input and output \nblocks and truncated input records to the standard error output.\n` },
  ],
};
