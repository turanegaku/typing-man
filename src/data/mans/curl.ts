import type { ManEntry } from './types.js';

export const curl: ManEntry = {
  command: 'curl',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'curl - transfer a URL\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `curl is a tool to transfer data from or to a server, using one of the \nsupported protocols (DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, \nIMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, \nSMTP, SMTPS, TELNET and TFTP). The command is designed to work without \nuser interaction.\n` },
    { kind: 'dd', text: `curl offers a busload of useful tricks like proxy support, user authen-\ntication, FTP upload, HTTP post, SSL connections, cookies, file trans-\nfer resume, Metalink, and more. As you will see below, the number of \nfeatures will make your head spin!\n` },
    { kind: 'dd', text: `curl is powered by libcurl for all transfer-related features. See \nlibcurl(3) for details.\n` },
  ],
};
