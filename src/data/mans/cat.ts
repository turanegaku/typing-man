import type { ManEntry } from './types.js';

export const cat: ManEntry = {
  command: 'cat',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'cat -- concatenate and print files\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The cat utility reads files sequentially, writing them to the standard \noutput. The file operands are processed in command-line order. If file \nis a single dash (\`-') or absent, cat reads from the standard input. If \nfile is a UNIX domain socket, cat connects to it and then reads it until \nEOF. This complements the UNIX domain binding capability available in \ninetd(8).\n` },
  ],
};
