import type { ManEntry } from './types.js';

export const mv: ManEntry = {
  command: 'mv',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'mv -- move files\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `In its first form, the mv utility renames the file named by the source \noperand to the destination path named by the target operand. This form \nis assumed when the last operand does not name an already existing direc-\ntory.\n` },
    { kind: 'dd', text: `In its second form, mv moves each file named by a source operand to a \ndestination file in the existing directory named by the directory oper-\nand. The destination path for each operand is the pathname produced by \nthe concatenation of the last operand, a slash, and the final pathname \ncomponent of the named file.\n` },
  ],
};
