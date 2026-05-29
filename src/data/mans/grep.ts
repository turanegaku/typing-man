import type { ManEntry } from './types.js';

export const grep: ManEntry = {
  command: 'grep',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'grep, egrep, fgrep, zgrep, zegrep, zfgrep -- file pattern searcher\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `The grep utility searches any given input files, selecting lines that \nmatch one or more patterns. By default, a pattern matches an input line \nif the regular expression (RE) in the pattern matches the input line \nwithout its trailing newline. An empty expression matches every line. \nEach input line that matches at least one of the patterns is written to \nthe standard output.\n` },
    { kind: 'dd', text: `grep is used for simple patterns and basic regular expressions (BREs); \negrep can handle extended regular expressions (EREs). See re_format(7) \nfor more information on regular expressions. fgrep is quicker than both \ngrep and egrep, but can only handle fixed patterns (i.e. it does not \ninterpret regular expressions). Patterns may consist of one or more \nlines, allowing any of the pattern lines to match a portion of the input.\n` },
    { kind: 'dd', text: `zgrep, zegrep, and zfgrep act like grep, egrep, and fgrep, respectively, \nbut accept input files compressed with the compress(1) or gzip(1) com-\npression utilities.\n` },
  ],
};
