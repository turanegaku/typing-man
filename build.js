const pug = require('pug');
const fs = require('fs');
const path = require('path');

// mans ディレクトリの一覧取得
const mansDir = './views/mans';
const mans = fs.existsSync(mansDir)
  ? fs.readdirSync(mansDir).filter(f => f.endsWith('.pug')).map(f => path.basename(f, '.pug'))
  : [];

// 共通injectデータ
const baseLocals = {
  keyboards: ['JIS', 'US'],
  layouts: ['QWERTY', 'Dvorak', 'Colemak'],
  keyboard: 'JIS',
  layout: 'QWERTY',
  title: 'typing-man'
};

const distDir = './dist';
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

// index.pugなどトップページ/html化
['index.pug'].forEach(page => {
  const html = pug.renderFile(`./views/${page}`, {
    ...baseLocals,
    mans,         // for index: 問題リストをinject
    holder: {},   // ダミー
  });
  fs.writeFileSync(`${distDir}/${page.replace('.pug','.html')}`, html);
});

// mansごと(html各ページ)を出力
const mansOutDir = `${distDir}/mans`;
if (!fs.existsSync(mansOutDir)) fs.mkdirSync(mansOutDir);

mans.forEach(man => {
  const pugFile = `${mansDir}/${man}.pug`;
  if (!fs.existsSync(pugFile)) return;
  const html = pug.renderFile(pugFile, {
    ...baseLocals,
    ranks: Array(10).fill({
      name: 'NoData',
      time: 0,
      timer: '00:00.00',
      error: '-'
    }),
    // yieldを埋めたい場合は下記が必要な場合も
    // question: "...ここにmanの問題テキスト ..."
  });
  fs.writeFileSync(`${mansOutDir}/${man}.html`, html);
});
