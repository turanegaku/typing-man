import type { ManEntry } from './types.js';

export const tar: ManEntry = {
  command: 'tar',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: `tar - manipulate tape archives
` },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `tar creates and manipulates streaming archive files.  This
implementation can extract from tar, pax, cpio, zip, jar, ar,
xar, rpm, 7-zip, and ISO 9660 cdrom images and can create tar,
pax, cpio, ar, zip, 7-zip, and shar archives.
` },
    { kind: 'dd', text: `The first synopsis form shows a "bundled" option word.  This
usage is provided for compatibility with historical
implementations.  See COMPATIBILITY below for details.
` },
    { kind: 'dd', text: `The other synopsis forms show the preferred usage.  The first
option to tar is a mode indicator from the following list:
-c      Create a new archive containing the specified items.  The
     long option form is --create.
-r      Like -c, but new entries are appended to the archive.
     Note that this only works on uncompressed archives stored
     in regular files.  The -f option is required.  The long
     option form is --append.
-t      List archive contents to stdout.  The long option form is
     --list.
-u      Like -r, but new entries are added only if they have a
     modification date newer than the corresponding entry in
     the archive.  Note that this only works on uncompressed
     archives stored in regular files.  The -f option is
     required.  The long form is --update.
-x      Extract to disk from the archive.  If a file with the
     same name appears more than once in the archive, each
     copy will be extracted, with later copies overwriting
     (replacing) earlier copies.  The long option form is
     --extract.
` },
    { kind: 'dd', text: `In -c, -r, or -u mode, each specified file or directory is added
to the archive in the order specified on the command line.  By
default, the contents of each directory are also archived.
` },
    { kind: 'dd', text: `In extract or list mode, the entire command line is read and
parsed before the archive is opened.  The pathnames or patterns
on the command line indicate which items in the archive should be
processed.  Patterns are shell-style globbing patterns as
documented in tcsh(1).
` },
  ],
};
