#!/usr/bin/env tsx
/**
 * add-man.ts — man ページからお題データファイルを自動生成するスクリプト
 *
 * 使い方:
 *   npm run add-man -- <コマンド名>
 *   npm run add-man -- grep
 *   npm run add-man -- tar
 *
 * 処理内容:
 *   1. `MANWIDTH=70 LC_ALL=C man -P cat <command>` を実行
 *   2. NAME / DESCRIPTION セクションを抽出・整形
 *   3. src/data/mans/<command>.ts を生成
 *   4. src/data/mans/index.ts に import と export を追記
 */

import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const command = process.argv[2]?.trim();

if (!command) {
  console.error('使い方: npm run add-man -- <コマンド名>');
  console.error('例:     npm run add-man -- grep');
  process.exit(1);
}

// TypeScript 識別子として安全な名前に変換（例: add-man → addMan）
function toIdentifier(name: string): string {
  return name.replace(/[-.](.)/g, (_, c: string) => c.toUpperCase());
}

const identifier = toIdentifier(command);
const outputPath = join('src', 'data', 'mans', `${command}.ts`);
const indexPath = join('src', 'data', 'mans', 'index.ts');

if (existsSync(outputPath)) {
  console.error(`エラー: ${outputPath} は既に存在します。`);
  console.error('上書きする場合はファイルを手動で削除してください。');
  process.exit(1);
}

// ---------- 1. man を実行 ----------
console.log(`man ${command} を取得中...`);
let manText: string;
try {
  manText = execSync(`MANWIDTH=70 LC_ALL=C man -P cat ${command}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  // macOS の man 出力はバックスペースによる太字フォーマット（N\bN）を含む
  // 例: NNAAMMEE → NAME に正規化
  manText = manText.replace(/.\x08/g, '');
} catch {
  console.error(`エラー: man ${command} の実行に失敗しました。`);
  console.error('コマンド名を確認し、man ページが存在するか確認してください。');
  process.exit(1);
}

// ---------- 2. セクションをパース ----------
type ParsedSection = { title: string; paragraphs: string[] };

function parseManSections(text: string): ParsedSection[] {
  const lines = text.split('\n');
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    // 末尾の空行を除去
    while (paragraphLines.length > 0 && paragraphLines[paragraphLines.length - 1].trim() === '') {
      paragraphLines.pop();
    }
    if (paragraphLines.length > 0 && current) {
      current.paragraphs.push(paragraphLines.join('\n') + '\n');
    }
    paragraphLines = [];
  }

  for (const line of lines) {
    // セクションヘッダ: 先頭が大文字の行（インデントなし）
    if (/^[A-Z][A-Z _/-]*$/.test(line.trimEnd()) && line[0] !== ' ') {
      flushParagraph();
      if (current) sections.push(current);
      current = { title: line.trim(), paragraphs: [] };
      continue;
    }

    if (!current) continue;

    // 空行 = 段落区切り
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // man のページヘッダ/フッタ行を除外（例: "ECHO(1)  BSD...  ECHO(1)"）
    if (/^\S.*\(\d+\)/.test(line) && /\(\d+\)\s*$/.test(line)) {
      continue;
    }

    // インデントを除去（man の実装によって 5〜7 スペースが異なるため全て除去）
    const stripped = line.replace(/^\s{1,8}/, '');
    paragraphLines.push(stripped);
  }

  flushParagraph();
  if (current) sections.push(current);

  return sections;
}

const allSections = parseManSections(manText);

// NAME と DESCRIPTION のみ抽出（お題として適切なセクション）
const targetSections = allSections.filter(
  (s) => s.title === 'NAME' || s.title === 'DESCRIPTION',
);

if (targetSections.length === 0) {
  console.error('エラー: NAME または DESCRIPTION セクションが見つかりませんでした。');
  console.error('man の出力を確認し、手動でファイルを作成してください。');
  process.exit(1);
}

// ---------- 3. TypeScript ファイルを生成 ----------
function escapeString(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

function generateLines(sections: ParsedSection[]): string {
  const lines: string[] = [];
  for (const section of sections) {
    lines.push(`    { kind: 'dt', text: '${section.title}' },`);
    for (const para of section.paragraphs) {
      lines.push(`    { kind: 'dd', text: \`${escapeString(para)}\` },`);
    }
  }
  return lines.join('\n');
}

const tsContent = `import type { ManEntry } from './types.js';

export const ${identifier}: ManEntry = {
  command: '${command}',
  lines: [
${generateLines(targetSections)}
  ],
};
`;

writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`✓ ${outputPath} を生成しました`);

// ---------- 4. index.ts を更新 ----------
let indexContent = readFileSync(indexPath, 'utf-8');

// import 文を追加（import type { ... } 行の直前に挿入）
const importLine = `import { ${identifier} } from './${command}.js';`;
if (indexContent.includes(importLine)) {
  console.log(`  (import 文は既に存在します)`);
} else {
  indexContent = indexContent.replace(
    /^(import type \{)/m,
    `${importLine}\n$1`,
  );
}

// mans 配列への追加（最後のエントリの後、];の前に挿入）
if (indexContent.includes(`  ${identifier},`)) {
  console.log(`  (mans 配列への追加は既に存在します)`);
} else {
  indexContent = indexContent.replace(
    /^(\];)/m,
    `  ${identifier},\n$1`,
  );
}

writeFileSync(indexPath, indexContent, 'utf-8');
console.log(`✓ ${indexPath} を更新しました`);

console.log('');
console.log('次のステップ:');
console.log(`  1. ${outputPath} を確認・必要に応じて修正してください`);
console.log(`  2. npm run typecheck でエラーがないか確認してください`);
console.log(`  3. npm run dev でローカル確認してください`);
