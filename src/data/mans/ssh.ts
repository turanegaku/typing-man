import type { ManEntry } from './types.js';

export const ssh: ManEntry = {
  command: 'ssh',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'ssh -- OpenSSH SSH client (remote login program)\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `ssh (SSH client) is a program for logging into a remote machine and for \nexecuting commands on a remote machine. It is intended to replace rlogin \nand rsh, and provide secure encrypted communications between two \nuntrusted hosts over an insecure network. X11 connections, arbitrary TCP \nports and UNIX-domain sockets can also be forwarded over the secure chan-\nnel.\n` },
    { kind: 'dd', text: `ssh connects and logs into the specified hostname (with optional user \nname). The user must prove his/her identity to the remote machine using \none of several methods depending on the protocol version used (see \nbelow).\n` },
    { kind: 'dd', text: 'If command is specified, it is executed on the remote host instead of a \nlogin shell.\n' },
  ],
};
