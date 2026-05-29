import type { ManEntry } from './types.js';

export const wget: ManEntry = {
  command: 'wget',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'Wget - The non-interactive network downloader.\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `GNU Wget is a free utility for non-interactive download of files from \nthe Web. It supports HTTP, HTTPS, and FTP protocols, as well as \nretrieval through HTTP proxies.\n` },
    { kind: 'dd', text: `Wget is non-interactive, meaning that it can work in the background, \nwhile the user is not logged on. This allows you to start a retrieval \nand disconnect from the system, letting Wget finish the work. By \ncontrast, most of the Web browsers require constant user's presence, \nwhich can be a great hindrance when transferring a lot of data.\n` },
    { kind: 'dd', text: `Wget can follow links in HTML, XHTML, and CSS pages, to create local \nversions of remote web sites, fully recreating the directory structure \nof the original site. This is sometimes referred to as "recursive \ndownloading." While doing that, Wget respects the Robot Exclusion \nStandard (/robots.txt). Wget can be instructed to convert the links in \ndownloaded files to point at the local files, for offline viewing.\n` },
    { kind: 'dd', text: `Wget has been designed for robustness over slow or unstable network \nconnections; if a download fails due to a network problem, it will keep \nretrying until the whole file has been retrieved. If the server \nsupports regetting, it will instruct the server to continue the \ndownload from where it left off.\n` },
  ],
};
