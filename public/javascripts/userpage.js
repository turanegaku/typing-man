/* global $ localStorage location */

$(() => {
    injectStyles();

    const SESSIONS_KEY   = 'typing-man:sessions';
    const username = decodeURIComponent(location.pathname.replace(/^\/user\//, ''));
    const container = $('#user-stats');

    // サーバーが埋め込んだ全お題リスト
    let allMans = [];
    try { allMans = JSON.parse(container.attr('data-mans') || '[]'); } catch {}

    // セッション読み込み
    let sessions = [];
    try { sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch {}
    const mine = sessions.filter(s => s.name === username);

    // マイルストーン読み込み
    let ms = {};
    try { ms = JSON.parse(localStorage.getItem('typing-man:milestones:' + username) || '{}'); } catch {}

    if (!mine.length) {
        container.html(
            '<p>「' + esc(username) + '」のデータがありません。</p>' +
            '<p><a href="/">ゲームをプレイしてデータを記録しましょう</a></p>'
        );
        return;
    }

    // ── 集計 ─────────────────────────────────────────────────────
    const totalChars  = mine.reduce((s, r) => s + (r.chars  || 0), 0);
    const totalTimeMs = mine.reduce((s, r) => s + (r.time   || 0), 0);
    const totalErrors = mine.reduce((s, r) => s + (r.error  || 0), 0);
    const cumCpm      = totalTimeMs > 0 ? Math.round(totalChars * 60000 / totalTimeMs) : 0;
    const cumCps      = totalTimeMs > 0 ? (totalChars / (totalTimeMs / 1000)).toFixed(2) : '0.00';
    const cumAccNum   = (totalChars + totalErrors) > 0
        ? totalChars / (totalChars + totalErrors) * 100 : 100;
    const cumAcc      = cumAccNum.toFixed(1);

    const uniqueDates = new Set(mine.map(s => new Date(s.date).toDateString()));
    const totalDays   = uniqueDates.size;

    // お題別プレイ回数（未プレイ含む全お題、プレイ回数降順・最大15件）
    const byMan = {};
    allMans.forEach(m => { byMan[m] = 0; });
    mine.forEach(s => { if (s.man) byMan[s.man] = (byMan[s.man] || 0) + 1; });
    const manEntries = Object.entries(byMan)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    const maxCount = Math.max(1, ...manEntries.map(([, c]) => c));

    // 苦手キー集計（ミス割合・平均反応時間を独立して集計）
    const keyAgg = {};
    mine.forEach(s => {
        if (!s.keyStats) return;
        Object.entries(s.keyStats).forEach(([ch, stat]) => {
            if (!keyAgg[ch]) keyAgg[ch] = { misses: 0, hits: 0, times: [] };
            keyAgg[ch].misses += stat.misses || 0;
            keyAgg[ch].hits   += (stat.times || []).length;
            if (stat.times) keyAgg[ch].times.push(...stat.times);
        });
    });
    const keyList = Object.entries(keyAgg).map(([ch, agg]) => {
        const total    = agg.misses + agg.hits;
        const missRate = total > 0 ? agg.misses / total : 0;
        const avgTime  = agg.times.length ? Math.round(agg.times.reduce((a, b) => a + b, 0) / agg.times.length) : 0;
        return { ch, misses: agg.misses, hits: agg.hits, missRate, avgTime };
    });
    const WEAK_N = 5;
    const weakByMiss = keyList.filter(k => k.misses > 0).sort((a, b) => b.missRate - a.missRate).slice(0, WEAK_N);
    const weakByTime = keyList.filter(k => k.avgTime > 0).sort((a, b) => b.avgTime - a.avgTime).slice(0, WEAK_N);
    const maxMissRate = weakByMiss.length ? weakByMiss[0].missRate : 1;
    const maxAvgTime  = weakByTime.length ? weakByTime[0].avgTime  : 1;

    // レーダー値
    const speedVal = Math.min(100, Math.round(cumCpm / 6));
    const accVal   = Math.round(cumAccNum);
    const allTimes = [];
    mine.forEach(s => {
        if (!s.keyStats) return;
        Object.values(s.keyStats).forEach(stat => { if (stat.times) allTimes.push(...stat.times); });
    });
    let fluencyVal = 50;
    if (allTimes.length > 1) {
        const mean = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
        const sd   = Math.sqrt(allTimes.reduce((a, b) => a + (b - mean) ** 2, 0) / allTimes.length);
        fluencyVal = Math.max(0, Math.min(100, Math.round(100 - (mean > 0 ? sd / mean : 1) * 30)));
    }

    // 詳細スタッツ
    const totalKeystrokes = totalChars + totalErrors;
    let stuckCount = 0;
    mine.forEach(s => {
        if (!s.keyStats) return;
        Object.values(s.keyStats).forEach(stat => {
            if (stat.times) stat.times.forEach(t => { if (t > 500) stuckCount++; });
        });
    });
    const maxCombo = totalErrors > 0 ? Math.round(totalChars / (totalErrors + 1) * 1.8) : totalChars;

    // ── 描画 ─────────────────────────────────────────────────────
    container.html(buildHTML());

    // CPM/CPS トグル
    let showCps = false;
    $('#sr-cpm-toggle').on('click', () => {
        showCps = !showCps;
        if (showCps) {
            $('#sr-cpm-val').text(cumCps);
            $('#sr-cpm-unit').text('CPS');
            $('#sr-cpm-hint').text('→ CPM に戻す');
        } else {
            $('#sr-cpm-val').text(cumCpm);
            $('#sr-cpm-unit').text('CPM');
            $('#sr-cpm-hint').text('→ CPS に切り替え');
        }
    });

    // バーアニメーション
    container.find('.sr-bar-fill').each(function() {
        const w = $(this).data('w');
        $(this).css('width', '2%').animate({ width: (w || 2) + '%' }, 900);
    });

    // ── ダウンロードボタン ────────────────────────────────────────
    $('#sr-btn-dl').on('click', function() {
        const btn = $(this);
        btn.text('⏳ 生成中...').prop('disabled', true);

        loadHtml2Canvas().then(h2c => {
            h2c(document.querySelector('.sr'), {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            }).then(canvas => {
                const a = document.createElement('a');
                a.download = 'typing-man-' + username + '.png';
                a.href = canvas.toDataURL('image/png');
                a.click();
                btn.text('⬇️ 画像をダウンロード').prop('disabled', false);
            }).catch(() => {
                alert('画像生成に失敗しました');
                btn.text('⬇️ 画像をダウンロード').prop('disabled', false);
            });
        });
    });

    // ── Twitter シェアボタン ─────────────────────────────────────
    $('#sr-btn-twitter').on('click', function() {
        const text = [
            '📊 タイピング通知表 #typing_man',
            'ユーザー：' + username,
            '累計 CPM：' + cumCpm,
            '累計 Acc：' + cumAcc + '%',
            '総プレイ回数：' + mine.length + '回',
        ].join('\n');
        const url = location.href;
        window.open(
            'https://x.com/intent/tweet?text=' + encodeURIComponent(text) +
            '&url=' + encodeURIComponent(url),
            '_blank', 'noopener'
        );
    });

    // html2canvas を動的ロード
    function loadHtml2Canvas() {
        if (window.html2canvas) return Promise.resolve(window.html2canvas);
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            s.onload = () => resolve(window.html2canvas);
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // ── HTML構築 ──────────────────────────────────────────────────
    function buildHTML() {
        return `
<div class="sr">
  <!-- オレンジ帯ヘッダー -->
  <div class="sr-head">
    <div class="sr-head-title">タイピング通知表</div>
    <div class="sr-head-user">ユーザー名：${esc(username)}</div>
  </div>

  <!-- CPM / CPS トグル + Acc -->
  <div class="sr-top-stats">
    <div id="sr-cpm-toggle" class="sr-cpm-box" title="クリックで CPS に切り替え">
      <div class="sr-top-label">累計</div>
      <div class="sr-top-val"><span id="sr-cpm-val">${cumCpm}</span><span id="sr-cpm-unit" class="sr-top-unit">CPM</span></div>
      <div id="sr-cpm-hint" class="sr-top-hint">→ CPS に切り替え</div>
    </div>
    <div class="sr-acc-box">
      <div class="sr-top-label">累計 Acc</div>
      <div class="sr-top-val">${cumAcc}<span class="sr-top-unit">%</span></div>
    </div>
  </div>

  <!-- サマリー -->
  <div class="sr-summary">
    <div class="sr-sum-box">
      <div class="sr-sum-label">総プレイ日数</div>
      <div class="sr-sum-num">${totalDays}<span class="sr-sum-unit">日</span></div>
    </div>
    <div class="sr-sum-box">
      <div class="sr-sum-label">総タイピング回数</div>
      <div class="sr-sum-num">${mine.length}<span class="sr-sum-unit">回</span></div>
    </div>
  </div>

  <!-- 2カラム -->
  <div class="sr-body">

    <!-- 左：横棒グラフ -->
    <div class="sr-left">
      <h3 class="sr-sec">お題ごとのプレイ回数</h3>
      <div class="sr-bars">
        ${manEntries.map(([man, cnt]) => {
            const pct = cnt > 0 ? Math.max(4, Math.round(cnt / maxCount * 100)) : 0;
            return `<div class="sr-bar-row">
              <div class="sr-bar-label"><a href="/${man}">${esc(man)}</a></div>
              <div class="sr-bar-track">
                ${cnt > 0
                    ? `<div class="sr-bar-fill" data-w="${pct}" style="width:2%">${cnt}回</div>`
                    : `<div class="sr-bar-zero">0回</div>`}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- 苦手キー：二軸別リスト -->
      <h3 class="sr-sec" style="margin-top:28px">苦手キー</h3>
      <div class="sr-weak-cols">
        <!-- ミスが多いキー -->
        <div class="sr-weak-col">
          <div class="sr-weak-col-head sr-weak-col-head--miss">ミス率が高い</div>
          ${weakByMiss.length === 0
            ? `<p class="sr-muted" style="font-size:.82em;padding:4px 0">データなし</p>`
            : weakByMiss.map((k, i) => {
                const pct      = Math.max(6, Math.round(k.missRate / maxMissRate * 100));
                const rateStr  = (k.missRate * 100).toFixed(0) + '%';
                return `<div class="sr-wk-row">
                  <span class="sr-wk-rank">${i + 1}</span>
                  <kbd class="sr-wk-key sr-wk-key--miss">${esc(k.ch)}</kbd>
                  <div class="sr-wk-track">
                    <div class="sr-wk-fill sr-wk-fill--miss" style="width:${pct}%">${rateStr}</div>
                  </div>
                </div>`;
              }).join('')
          }
        </div>
        <!-- 反応が遅いキー -->
        <div class="sr-weak-col">
          <div class="sr-weak-col-head sr-weak-col-head--time">反応が遅い</div>
          ${weakByTime.length === 0
            ? `<p class="sr-muted" style="font-size:.82em;padding:4px 0">データなし</p>`
            : weakByTime.map((k, i) => {
                const pct = Math.max(6, Math.round(k.avgTime / maxAvgTime * 100));
                return `<div class="sr-wk-row">
                  <span class="sr-wk-rank">${i + 1}</span>
                  <kbd class="sr-wk-key sr-wk-key--time">${esc(k.ch)}</kbd>
                  <div class="sr-wk-track">
                    <div class="sr-wk-fill sr-wk-fill--time" style="width:${pct}%">${k.avgTime}ms</div>
                  </div>
                </div>`;
              }).join('')
          }
        </div>
      </div>
    </div>

    <!-- 右 -->
    <div class="sr-right">

      <!-- レーダーチャート -->
      <div class="sr-block">
        <h3 class="sr-sec">タイピング傾向</h3>
        ${buildRadar(speedVal, accVal, fluencyVal)}
      </div>

      <!-- マイルストーン -->
      <div class="sr-block">
        <h3 class="sr-sec">記念マイルストーン</h3>
        ${buildMilestones()}
      </div>

      <!-- 詳細スタッツ -->
      <div class="sr-block">
        <h3 class="sr-sec">詳細スタッツ</h3>
        <table class="sr-table">
          <tbody>
            ${tr('累計総打鍵数',         totalKeystrokes.toLocaleString() + ' 回', 0)}
            ${tr('無駄打ち数',           totalErrors.toLocaleString() + ' 回',     1)}
            ${tr('最長ノーミスコンボ',    maxCombo.toLocaleString() + ' 文字',      0)}
            ${tr('キー詰まり（500ms超）', stuckCount.toLocaleString() + ' 回',      1)}
            ${tr('プレイ時間合計',        fmtTime(totalTimeMs),                     0)}
          </tbody>
        </table>
      </div>

    </div>
  </div>
</div>
<hr>
<div class="sr-actions">
  <button id="sr-btn-dl"      class="sr-action-btn">⬇️ 画像をダウンロード</button>
  <button id="sr-btn-twitter" class="sr-action-btn sr-action-btn--tw" style="display:none">𝕏 Twitter でシェア</button>
</div>`;
    }

    // ── マイルストーン ────────────────────────────────────────────
    function buildMilestones() {
        const rows = [];

        // 最初にプレイ
        if (ms.firstPlay) {
            rows.push(`🎮 最初のプレイ：<strong>${esc(ms.firstPlay.man)}</strong> <span class="sr-date">${fmtDate(ms.firstPlay.date)}</span>`);
        } else if (mine.length) {
            const f = mine[mine.length - 1];
            rows.push(`�� 最初のプレイ：<strong>${esc(f.man)}</strong> <span class="sr-date">${fmtDate(f.date)}</span>`);
        }

        // 最高 CPM
        if (ms.cpmMax) {
            rows.push(`🏆 最高 CPM：<strong>${ms.cpmMax.cpm} CPM</strong>（${esc(ms.cpmMax.man)}）<span class="sr-date">${fmtDate(ms.cpmMax.date)}</span>`);
        }

        // 初Acc 100%
        const firstPerfect = mine.slice().reverse().find(s => (s.accuracy || 0) >= 100);
        if (firstPerfect) {
            rows.push(`🎯 初 Acc 100%：<strong>${esc(firstPerfect.man)}</strong> <span class="sr-date">${fmtDate(firstPerfect.date)}</span>`);
        } else {
            rows.push(`🎯 初 Acc 100%：<span class="sr-muted">未達成</span>`);
        }

        // CPM マイルストーン
        const cpmMs = ms.cpmMilestones || {};
        [100, 200, 300, 400, 500].forEach(thresh => {
            const icon = ['🌱', '⚡', '🔥', '💎', '🚀'][thresh / 100 - 1];
            if (cpmMs[thresh]) {
                rows.push(`${icon} CPM ${thresh} 達成：<strong>${esc(cpmMs[thresh].man)}</strong> <span class="sr-date">${fmtDate(cpmMs[thresh].date)}</span>`);
            } else {
                rows.push(`${icon} CPM ${thresh} 達成：<span class="sr-muted">未達成</span>`);
            }
        });

        return rows.map(r => `<div class="sr-milestone">${r}</div>`).join('');
    }

    // ── SVGレーダーチャート ──────────────────────────────────────
    function buildRadar(speed, acc, flu) {
        const W = 280, H = 230;
        const cx = 140, cy = 120, r = 76;

        const axes = [
            { deg: -90, val: speed / 100 },
            { deg:  30, val: acc   / 100 },
            { deg: 150, val: flu   / 100 },
        ];
        const pt = (deg, radius) => {
            const rad = deg * Math.PI / 180;
            return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
        };
        const poly = f => axes.map(a => pt(a.deg, r * f).join(',')).join(' ');
        const dPoly = axes.map(a => pt(a.deg, r * Math.max(0.04, a.val)).join(',')).join(' ');

        const dots = axes.map(a => {
            const [x, y] = pt(a.deg, r * Math.max(0.04, a.val));
            return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="darkorange"/>`;
        }).join('');
        const axisLines = axes.map(a => {
            const [x, y] = pt(a.deg, r);
            return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#ccc" stroke-width="1"/>`;
        }).join('');

        // ラベルは固定位置（切れない位置に配置）
        const labelSvg = [
            `<text x="${cx}"   y="16"       text-anchor="middle" font-size="11" fill="#555">速度 ${speed}</text>`,
            `<text x="${W-8}"  y="${H-8}"   text-anchor="end"    font-size="11" fill="#555">正確性 ${acc}</text>`,
            `<text x="8"       y="${H-8}"   text-anchor="start"  font-size="11" fill="#555">流暢さ ${flu}</text>`,
        ].join('');

        return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="sr-radar">
          <polygon points="${poly(1)}"    fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
          <polygon points="${poly(0.67)}" fill="none"    stroke="#ddd" stroke-width="1"/>
          <polygon points="${poly(0.33)}" fill="none"    stroke="#ddd" stroke-width="1"/>
          ${axisLines}
          <polygon points="${dPoly}" fill="rgba(255,140,0,0.28)" stroke="rgba(255,100,0,0.85)" stroke-width="2"/>
          ${dots}
          ${labelSvg}
        </svg>`;
    }

    // ── ヘルパー ──────────────────────────────────────────────────
    function tr(label, val, stripe) {
        return `<tr class="${stripe ? 'alt' : ''}"><td>${label}</td><td><strong>${val}</strong></td></tr>`;
    }
    function fmtTime(ms) {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        return h > 0 ? `${h}時間${m % 60}分` : `${m}分${s % 60}秒`;
    }
    function fmtDate(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        return d.getFullYear() + '/' +
            String(d.getMonth() + 1).padStart(2, '0') + '/' +
            String(d.getDate()).padStart(2, '0');
    }
    function esc(s) { return $('<span>').text(String(s)).html(); }

    // ── スタイル注入 ──────────────────────────────────────────────
    function injectStyles() {
        $('<style>').text(`
#user-stats { padding-bottom: 40px; }
.sr { max-width: 900px; margin: 0 auto; padding-right: 30px; font-size: 14px; }

/* ── オレンジ帯ヘッダー ── */
.sr-head {
    background: linear-gradient(135deg, #ff8c00 0%, #e65100 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    border-radius: 8px 8px 0 0;
}
.sr-head-title { font-size: 1.9em; font-weight: bold; letter-spacing: .05em; white-space: nowrap; }
.sr-head-user  { font-size: .9em; opacity: .88; }

/* ── CPM / CPS トグル ── */
.sr-top-stats {
    display: flex;
    gap: 12px;
    background: #fff8f0;
    border: 1px solid #ffd0a0;
    border-top: none;
    padding: 16px 24px;
}
.sr-cpm-box, .sr-acc-box {
    flex: 1;
    background: #fff;
    border: 1px solid #ffc87a;
    border-radius: 8px;
    padding: 12px 20px;
    text-align: center;
}
.sr-cpm-box {
    cursor: pointer;
    transition: background .2s;
}
.sr-cpm-box:hover { background: #fff5e0; }
.sr-top-label { font-size: .75em; color: #999; margin-bottom: 2px; }
.sr-top-val   { font-size: 2.6em; font-weight: bold; color: #e65100; line-height: 1.1; }
.sr-top-unit  { font-size: .4em;  margin-left: 4px; color: #bbb; }
.sr-top-hint  { font-size: .7em; color: #bbb; margin-top: 2px; }

/* ── サマリー ── */
.sr-summary {
    display: flex;
    gap: 12px;
    background: #fff8f0;
    border: 1px solid #ffd0a0;
    border-top: none;
    padding: 12px 24px 16px;
}
.sr-sum-box {
    flex: 1;
    background: #fff;
    border: 1px solid #ffc87a;
    border-radius: 8px;
    padding: 10px 18px;
    text-align: center;
}
.sr-sum-label { font-size: .75em; color: #999; margin-bottom: 2px; white-space: nowrap; }
.sr-sum-num   { font-size: 2em; font-weight: bold; color: #e65100; }
.sr-sum-unit  { font-size: .45em; margin-left: 2px; color: #bbb; }

/* ── 2カラム ── */
.sr-body {
    display: flex;
    border: 1px solid #ffd0a0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
}
.sr-left  { flex: 1.1; padding: 20px 20px; border-right: 1px solid #ffd0a0; }
.sr-right { flex: 1;   padding: 20px 20px; display: flex; flex-direction: column; gap: 18px; }

.sr-sec {
    font-size: .95em;
    font-weight: bold;
    color: #e65100;
    border-bottom: 2px solid #ffd0a0;
    padding-bottom: 4px;
    margin: 0 0 12px;
    white-space: normal;
}

/* ── 横棒グラフ ── */
.sr-bars { display: flex; flex-direction: column; gap: 7px; }
.sr-bar-row   { display: flex; align-items: center; gap: 10px; }
.sr-bar-label {
    width: 70px; font-size: .86em; font-weight: bold;
    text-align: right; color: #555; flex-shrink: 0;
}
.sr-bar-label a {
    color: #555;
    text-decoration: none;
}
.sr-bar-label a:hover {
    color: #e65100;
    text-decoration: underline;
}
.sr-bar-track { flex: 1; background: #f0f0f0; border-radius: 4px; overflow: hidden; min-height: 22px; }
.sr-bar-fill  {
    background: linear-gradient(90deg, #ff8c00 0%, #ffd000 100%);
    color: #fff; font-size: .72em; font-weight: bold;
    padding: 4px 8px; border-radius: 4px;
    white-space: nowrap; min-width: 28px;
    text-shadow: 0 1px 2px rgba(0,0,0,.25);
}
.sr-bar-zero {
    color: #ccc; font-size: .72em; padding: 4px 8px;
}

/* ── レーダー ── */
.sr-radar { display: block; margin: 0 auto; }

/* ── マイルストーン ── */
.sr-milestone { font-size: .88em; color: #444; margin-bottom: 5px; white-space: normal; line-height: 1.5; }
.sr-muted { color: #ccc; }
.sr-date  { font-size: .85em; color: #aaa; margin-left: 4px; }

/* ── 苦手キー ── */
.sr-weak-cols { display: flex; gap: 12px; }
.sr-weak-col  { flex: 1; min-width: 0; }
.sr-weak-col-head { font-size: .78em; font-weight: bold; padding: 3px 6px; border-radius: 3px 3px 0 0; margin-bottom: 4px; }
.sr-weak-col-head--miss { background: #fff3e0; color: #e65100; border-bottom: 2px solid #ffb74d; }
.sr-weak-col-head--time { background: #fff8e1; color: #f57f17; border-bottom: 2px solid #ffd54f; }
.sr-wk-row   { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.sr-wk-rank  { width: 14px; font-size: .75em; color: #bbb; text-align: right; flex-shrink: 0; }
.sr-wk-key   {
  display: inline-block; min-width: 26px; padding: 1px 4px;
  border-radius: 3px; font-family: monospace; font-size: .85em;
  text-align: center; flex-shrink: 0; white-space: pre;
}
.sr-wk-key--miss { background: #fff3e0; border: 1px solid #ffb74d; color: #e65100; }
.sr-wk-key--time { background: #fff8e1; border: 1px solid #ffd54f; color: #f57f17; }
.sr-wk-track { flex: 1; background: #f0f0f0; border-radius: 3px; overflow: hidden; height: 16px; min-width: 0; }
.sr-wk-fill  { height: 16px; line-height: 16px; font-size: .72em; padding-left: 4px; white-space: nowrap; border-radius: 3px; }
.sr-wk-fill--miss { background: linear-gradient(90deg, #ff8f00, #ffb300); color: #fff; }
.sr-wk-fill--time { background: linear-gradient(90deg, #ffc107, #ffe082); color: #5d4037; }

/* ── 詳細テーブル ── */
.sr-table { width: 100%; border-collapse: collapse; font-size: .88em; }
.sr-table td { padding: 6px 10px; }
.sr-table td:first-child { color: #555; }
.sr-table td:last-child  { text-align: right; font-variant-numeric: tabular-nums; }
.sr-table tr     td { background: #fff; }
.sr-table tr.alt td { background: #fafafa; }
.sr-table strong { color: #222; font-weight: bold; }
.sr-block {}

/* ── シェアボタン ── */
.sr-actions {
    display: flex;
    gap: 12px;
    padding: 4px 0 16px;
    max-width: 900px;
    margin: 0 auto;
    padding-right: 30px;
}
.sr-action-btn {
    flex: 1;
    padding: 12px 0;
    font-size: 1em;
    font-family: inherit;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #555;
    color: #fff;
    transition: opacity .2s;
}
.sr-action-btn:hover    { opacity: .85; }
.sr-action-btn:disabled { opacity: .5; cursor: not-allowed; }
.sr-action-btn--tw { background: #000; }
        `).appendTo('head');
    }
});
