import type { ManEntry } from './types.js';

export const echo: ManEntry = {
  command: 'echo',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'echo -- write arguments to the standard output\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: "The echo utility writes any specified operands, separated by single blank \n(` ') characters and followed by a newline (`\\n') character, to the stan-\ndard output.\n" },
  ],
};
