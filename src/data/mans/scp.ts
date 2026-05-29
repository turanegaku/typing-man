import type { ManEntry } from './types.js';

export const scp: ManEntry = {
  command: 'scp',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'scp -- secure copy (remote file copy program)\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `scp copies files between hosts on a network. It uses ssh(1) for data \ntransfer, and uses the same authentication and provides the same security \nas ssh(1). scp will ask for passwords or passphrases if they are needed \nfor authentication.\n` },
    { kind: 'dd', text: "File names may contain a user and host specification to indicate that the \nfile is to be copied to/from that host. Local file names can be made \nexplicit using absolute or relative pathnames to avoid scp treating file \nnames containing `:' as host specifiers. Copies between two remote hosts \nare also permitted.\n" },
  ],
};
