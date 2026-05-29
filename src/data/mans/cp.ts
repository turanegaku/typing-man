import type { ManEntry } from './types.js';

export const cp: ManEntry = {
  command: 'cp',
  lines: [
    { kind: 'dt', text: 'NAME' },
    { kind: 'dd', text: 'cp -- copy files\n' },
    { kind: 'dt', text: 'DESCRIPTION' },
    { kind: 'dd', text: `In the first synopsis form, the cp utility copies the contents of the \nsource_file to the target_file. In the second synopsis form, the con-\ntents of each named source_file is copied to the destination \ntarget_directory. The names of the files themselves are not changed. If \ncp detects an attempt to copy a file to itself, the copy will fail.\n` },
  ],
};
