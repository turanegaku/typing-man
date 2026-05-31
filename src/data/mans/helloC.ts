import type { ManEntry } from './types.js';

// helloC は man page 形式ではなく C プログラムのタイピング課題
export const helloC: ManEntry = {
  command: 'helloC',
  lines: [
    { kind: 'dd', text: '#include<stdio.h>\n' },
    { kind: 'dd-blank' },
    { kind: 'dd', text: 'int main(void) {\n' },
    { kind: 'dd-tab', text: 'printf("hello world!!!\\n");\n' },
    { kind: 'dd', text: '}\n' },
  ],
};
