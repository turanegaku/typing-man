import type { ManEntry } from './types.js';

export const ls: ManEntry = {
  command: 'ls',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'ls -- list directory contents\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `For each operand that names a file of a type other than directory, ls \ndisplays its name as well as any requested, associated information. For \neach operand that names a file of type directory, ls displays the names \nof files contained within that directory, as well as any requested, asso-\nciated information.\n` },
    { kind: 'dd', text: `If no operands are given, the contents of the current directory are dis-\nplayed. If more than one operand is given, non-directory operands are \ndisplayed first; directory and non-directory operands are sorted sepa-\nrately and in lexicographical order.\n` },
  ],
};
