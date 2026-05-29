/* global $ moment location document window localStorage */

$(() => {
    // ── constants ──────────────────────────────────────────────
    const CLEAN  = 0;
    const TYPING = 1 << 0;
    const FINISH = 1 << 1;
    const SESSIONS_KEY = 'typing-man:sessions';
    const SESSION_MAX  = 30;

    // ── utility ────────────────────────────────────────────────
    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function isnl(e) {
        return e.which === 13 || (e.ctrlKey && (e.which === 77 || e.which === 109));
    }
    function isback(e) {
        return e.which === 8 || (e.ctrlKey && (e.which === 72 || e.which === 104));
    }
    function isignore(e) {
        return e.which === 8 || e.which === 32 || e.which === 39 || e.which === 47;
    }

    // ── prepare text ───────────────────────────────────────────
    $('#question :not(:has(p))').contents()
    .filter((_, t) => t.nodeType === 3)
    .each((_, txt) => {
        $(txt).replaceWith(
            $(txt).text()
                .replace(/(.)/g, '<span>$1</span>')
                .replace(/<span>-<\/span>\n/g, '<span class="skip">-</span>\n')
        );
    });
    $('#question span:last-child').after('<span class="enter"> </span>');

    // ── elements & persistent state ────────────────────────────
    const manCommand  = $('#question').data('command');
    let   username    = $.cookie('name');

    const questions   = $('#question span:not(:has(*))');
    const miss        = $('#miss');
    const rank        = $('#rank');
    const error       = $('#error .value');
    const timer       = $('#time .value');
    const cpmEl       = $('#cpm .value');
    const accEl       = $('#accuracy .value');
    const graphCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById('cpm-graph'));

    // ── per-game state ─────────────────────────────────────────
    let step, start_time, end_time, interval_id, reviewal_id;
    let itr_question, question;
    const appeal = $('<div>', { class: 'ring' });

    let keyStats, typedCount, cpmHistory, questionActiveTime, lastSampleMs;
    let finalCpm = 0, finalAccuracy = 100;

    // ghost
    let ghostTimes = null, ghostIntervalId = null;

    // ── initialize ─────────────────────────────────────────────
    initialize();

    function initialize() {
        step          = CLEAN;
        keyStats      = {};
        typedCount    = 0;
        cpmHistory    = [];
        lastSampleMs  = 0;
        finalCpm      = 0;
        finalAccuracy = 100;

        // reload ghost (picks up new personal best after restart)
        const stored = _loadGhost();
        ghostTimes = (stored && Array.isArray(stored.times) && stored.times.length === questions.length)
            ? stored.times : null;

        if (ghostIntervalId) { clearInterval(ghostIntervalId); ghostIntervalId = null; }
        questions.removeClass('ghost-now');

        clearInterval(interval_id);
        clearInterval(reviewal_id);
        start_time = moment();
        _updateDisplay();

        questions.removeClass('done miss now').css('opacity', '');
        itr_question = questions[Symbol.iterator]();
        question = $(itr_question.next().value);
        question.addClass('now');

        miss.children().remove();
        error.text('0');
        cpmEl.text('---');
        accEl.text('---%');

        $('#option button#review').attr('disabled', 'disabled');
        $('#option button#restart').removeAttr('disabled');
        question.append(appeal);

        if (graphCanvas) graphCanvas.style.display = 'none';
    }

    // ── display update ─────────────────────────────────────────
    function _updateDisplay() {
        end_time = moment();
        timer.text(moment(end_time - start_time).format('mm:ss.SS'));

        if (typedCount > 0 && (step & TYPING) && !(step & FINISH)) {
            const ms = moment() - start_time;
            if (ms > 0) {
                const cpm = Math.round(typedCount * 60000 / ms);
                cpmEl.text(cpm);
                const att = typedCount + (+error.text());
                accEl.text((att > 0 ? (typedCount / att * 100).toFixed(1) : '100.0') + '%');

                // 5秒ごとにグラフ用データを記録
                if (ms - lastSampleMs >= 5000) {
                    cpmHistory.push({ elapsed: Math.round(ms), cpm });
                    lastSampleMs = ms;
                }
            }
        }
    }

    // ── game start ─────────────────────────────────────────────
    function start_type() {
        step               |= TYPING;
        start_time          = moment();
        questionActiveTime  = moment();
        lastSampleMs        = 0;
        // 開始点（グラフが常に2点以上になるよう保証）
        cpmHistory.push({ elapsed: 0, cpm: 0 });
        interval_id         = setInterval(_updateDisplay, 50);
        appeal.remove();
        _startGhost();
    }

    // ── ghost ──────────────────────────────────────────────────
    function _loadGhost() {
        try { return JSON.parse(localStorage.getItem('ghost:' + manCommand) || 'null'); }
        catch { return null; }
    }

    // ゴースト再生：review ボタンと同じカーソル方式で並走
    function _startGhost() {
        if (!ghostTimes) return;
        let pos = 0;
        const ghostStart = moment();

        ghostIntervalId = setInterval(() => {
            const elapsed = moment() - ghostStart;
            let moved = false;
            while (pos < ghostTimes.length && ghostTimes[pos] <= elapsed) {
                questions.eq(pos).removeClass('ghost-now');
                pos++;
                moved = true;
            }
            if (moved && pos < questions.length) {
                questions.eq(pos).addClass('ghost-now');
            }
            if (pos >= ghostTimes.length) {
                clearInterval(ghostIntervalId);
                ghostIntervalId = null;
            }
        }, 50);
    }

    function _saveGhost(gameTimeMs) {
        const stored = _loadGhost();
        if (!stored || gameTimeMs < stored.time) {
            const times = questions.toArray().map(q => +($(q).attr('time') || 0));
            localStorage.setItem('ghost:' + manCommand, JSON.stringify({
                time: Math.round(gameTimeMs),
                times,
            }));
        }
    }

    // ── game finish ────────────────────────────────────────────
    function finish_type() {
        step |= FINISH;
        clearInterval(interval_id);
        if (ghostIntervalId) { clearInterval(ghostIntervalId); ghostIntervalId = null; }
        questions.removeClass('ghost-now');
        _updateDisplay();

        const elapsed = end_time - start_time;
        finalCpm      = elapsed > 0 ? Math.round(typedCount * 60000 / elapsed) : 0;
        const att     = typedCount + (+error.text());
        finalAccuracy = att > 0 ? Math.round(typedCount / att * 1000) / 10 : 100;
        cpmEl.text(finalCpm);
        accEl.text(finalAccuracy + '%');
        if (typedCount > 0 && elapsed > 0) {
            cpmHistory.push({ elapsed: Math.round(elapsed), cpm: finalCpm });
        }

        _saveGhost(elapsed);
        setTimeout(_drawGraph, 100);

        questions.animate({ opacity: 1 }, 'slow', 'easeInQuad');
        $('#option button#restart').attr('disabled', 'disabled');

        // name entry row in ranking
        const nameSpans = [];
        if (username) {
            for (let i = 0; i < username.length; i++) {
                nameSpans.push($('<span>', { text: username[i] }));
            }
        }
        nameSpans.push($('<span>', { text: ' ', class: 'enter now' }));
        nameSpans.push($('<span>', { text: 'your name.', class: 'yet' }));

        const my = _newRecord({ name: nameSpans, time: elapsed, error: +error.text(), cpm: finalCpm }, true);
        if (my.hasClass('out')) {
            my.insertAfter(rank.find('ol > li').last()).hide().show(500);
        }
        if (rank.offset().top + rank.height() > $(window).height()) {
            $('body,html').animate({ scrollTop: rank.offset().top }, 800, 'swing');
        }
    }

    function _newRecord(result, my) {
        const dom = $('<li>')
            .append($('<div>', { class: 'inline-2 name' }).append(result.name))
            .append($('<div>', { t: result.time, text: moment(+result.time).format('mm:ss.SS'), class: 'inline-2 time' }))
            .append($('<div>', { text: result.error + ' err', class: 'inline-1 error' }))
            .append($('<div>', { text: (result.cpm || 0) + ' CPM', class: 'inline-2 cpm' }));
        if (my) dom.addClass('my');

        let placed = false;
        const rows = rank.find('ol > li:not(.out)');
        rows.each((_, r) => {
            const rec = $(r);
            const t   = +rec.children('.time').attr('t');
            const e   = parseInt(rec.children('.error').text()) || 0;
            if (result.time < t || (result.time === t && result.error <= e)) {
                dom.insertBefore(rec).hide().show(500);
                placed = true;
                // 最下位を out に
                const last = rank.find('ol > li:not(.out)').last();
                last.addClass('out').hide(500, () => last.remove());
                return false;
            }
        });
        if (!placed) dom.addClass('out');
        return dom;
    }

    // ── CPM graph ──────────────────────────────────────────────
    function _drawGraph() {
        if (!graphCanvas || cpmHistory.length < 2) return;
        graphCanvas.style.display = 'block';
        const W = graphCanvas.width, H = graphCanvas.height;
        const ctx = graphCanvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);

        const maxCpm  = Math.ceil(Math.max(...cpmHistory.map(p => p.cpm)) * 1.15 / 10) * 10 || 60;
        const totalMs = cpmHistory[cpmHistory.length - 1].elapsed;

        // background
        ctx.fillStyle = 'rgba(240,248,255,0.9)';
        ctx.fillRect(0, 0, W, H);

        // grid
        const gridStep = maxCpm <= 120 ? 20 : 50;
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1;
        ctx.font = '11px monospace';
        for (let w = 0; w <= maxCpm; w += gridStep) {
            const y = H - (w / maxCpm) * H;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            ctx.fillStyle = '#aaa';
            ctx.fillText(w, 3, y - 2);
        }

        // ghost reference line
        const ghost = _loadGhost();
        if (ghost && ghost.time > 0) {
            const gCpm = Math.round(typedCount * 60000 / ghost.time);
            const gy   = H - (gWpm / maxCpm) * H;
            ctx.save();
            ctx.strokeStyle = 'rgba(255,140,0,0.75)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
            ctx.restore();
            ctx.fillStyle = 'rgba(255,140,0,0.9)';
            ctx.fillText('ghost ' + gCpm + ' CPM', W - 130, gy - 3);
        }

        // user CPM line
        ctx.strokeStyle = 'royalblue'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        cpmHistory.forEach(({ elapsed, cpm }, i) => {
            const x = (elapsed / totalMs) * W;
            const y = H - (cpm / maxCpm) * H;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = '#333'; ctx.font = 'bold 12px monospace';
        ctx.fillText('CPM', 3, 14);
    }

    // ── save session to localStorage ───────────────────────────
    function _saveSession(name) {
        let sessions = [];
        try { sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch {}
        sessions.unshift({
            man: manCommand, name,
            time: Math.round(end_time - start_time),
            chars: typedCount,
            error: +error.text(),
            cpm: finalCpm,
            accuracy: finalAccuracy,
            date: Date.now(),
            keyStats,
            cpmHistory,
        });
        if (sessions.length > SESSION_MAX) sessions.length = SESSION_MAX;
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }

    // ── save milestones to localStorage ────────────────────────
    function _saveMilestones(name) {
        const key = 'typing-man:milestones:' + name;
        let ms = {};
        try { ms = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
        const now = Date.now();

        // 最高 CPM 更新
        if (!ms.cpmMax || finalCpm > ms.cpmMax.cpm) {
            ms.cpmMax = { date: now, man: manCommand, cpm: finalCpm };
        }
        // 初回プレイ記録
        if (!ms.firstPlay) {
            ms.firstPlay = { date: now, man: manCommand };
        }
        // CPM マイルストーン（初達成のみ）
        if (!ms.cpmMilestones) ms.cpmMilestones = {};
        [100, 200, 300, 400, 500].forEach(thresh => {
            if (finalCpm >= thresh && !ms.cpmMilestones[thresh]) {
                ms.cpmMilestones[thresh] = { date: now, man: manCommand, cpm: finalCpm };
            }
        });

        localStorage.setItem(key, JSON.stringify(ms));
    }

    // ── next char ──────────────────────────────────────────────
    function nextChar() {
        const elapsed = Math.round(moment() - start_time);

        if (!question.hasClass('skip') && !question.hasClass('enter')) {
            const reaction = questionActiveTime ? Math.round(moment() - questionActiveTime) : 0;
            const ch = question.text();
            if (!keyStats[ch]) keyStats[ch] = { times: [], misses: 0 };
            keyStats[ch].times.push(reaction);
            if (keyStats[ch].times.length > 5) keyStats[ch].times.shift();
            typedCount++;
        }

        question.attr('time', elapsed).addClass('done').removeClass('now ghost-now');

        const dx = getRandomArbitary(-30, 30);
        const dy = getRandomArbitary(250, 350);
        const cl = question.clone().removeClass('ghost-now');
        const p  = question.position();
        cl.css({ left: p.left, top: p.top })
            .appendTo('#drop')
            .animate({ left: '+=' + dx + 'px' }, { duration: 1000, queue: false })
            .animate({ top:  '+=' + dy + 'px' }, { duration: 1000, queue: false, easing: 'easeInOutBack' })
            .fadeOut(700, 'easeInCubic', () => cl.remove());
        question.css({ opacity: 0.1 });

        const nq = itr_question.next();
        if (nq.done) { finish_type(); }
        question = $(nq.value);
        question.addClass('now');
        questionActiveTime = moment();
        if (question.hasClass('skip')) { nextChar(); }
    }

    // ── key handlers ───────────────────────────────────────────
    $(document).keydown(e => {
        if (step & TYPING) {
            if (!(step & FINISH)) {
                if (isback(e)) {
                    if (miss.children().length) miss.children().last().remove();
                    return false;
                } else if (isnl(e)) {
                    if (!miss.children().length && !question.next().length) nextChar();
                    return false;
                }
            } else {
                const nameEl = rank.find('ol > li.my .name');
                if (isback(e)) {
                    nameEl.children(':not(.enter):not(.yet)').last().remove();
                    return false;
                } else if (isnl(e)) {
                    step &= ~TYPING;
                    nameEl.children('.enter, .yet').remove();
                    const submittedName = nameEl.text();

                    _saveSession(submittedName);
                    _saveMilestones(submittedName);

                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'text',
                        data: JSON.stringify({
                            name:     submittedName,
                            time:     Math.round(end_time - start_time),
                            error:    +error.text(),
                            cpm:      finalCpm,
                            accuracy: finalAccuracy,
                        }),
                        error: () => {
                            const msg = $('<p>', { text: 'BadRequest!!' });
                            msg.insertAfter($('#info p').last()).hide().show(500)
                                .delay(1000).hide(200, () => msg.remove());
                        }
                    });

                    username = submittedName;
                    $.cookie('name', username);
                    $('#option button').removeAttr('disabled');

                    // 名前をスタッツページへのリンクに変換
                    nameEl.html($('<a>', {
                        href: '/user/' + encodeURIComponent(submittedName),
                        text: submittedName,
                    }));

                    rank.find('ol > li.my.out').hide(200, function() { $(this).remove(); });
                    rank.find('li.my').removeClass('my');

                    return false;
                }
            }
        }
    });

    $(document).keypress(e => {
        if (e.which === 0) return true;
        if (step === CLEAN && !isignore(e)) start_type();

        if (step & TYPING) {
            if (!(step & FINISH)) {
                if (question.text() === String.fromCharCode(e.which)) {
                    if (!miss.children().length && question.next().length) nextChar();
                } else {
                    error.text(+error.text() + 1);
                    question.addClass('miss');

                    const ch = question.text();
                    if (!keyStats[ch]) keyStats[ch] = { times: [], misses: 0 };
                    keyStats[ch].misses++;

                    const pos = question.position();
                    miss.css({ left: pos.left, top: pos.top })
                        .append(question.clone().removeClass('ghost-now').text(String.fromCharCode(e.which)));
                }
            } else {
                const nameEl = rank.find('ol > li.my .name');
                if (nameEl.children(':not(.enter):not(.yet)').length < 12) {
                    nameEl.children('.enter').before($('<span>', { text: String.fromCharCode(e.which) }));
                }
            }
        }

        if ((step & TYPING) && isignore(e)) return false;
    });

    // ── buttons ────────────────────────────────────────────────
    $('#option button#restart').click(() => {
        initialize();
        question.focus();
    });

    $('#option button#review').click(() => {
        $('#option button#review').attr('disabled', 'disabled');
        start_time = moment();
        questions.removeClass('done');

        const itr = questions[Symbol.iterator]();
        let q = $(itr.next().value);
        q.addClass('now');
        const savedTime = timer.text();

        reviewal_id = setInterval(() => {
            end_time = moment();
            timer.text(moment(end_time - start_time).format('mm:ss.SS'));
            if (+q.attr('time') < moment() - start_time) {
                q.addClass('done').removeClass('now');
                const nq = itr.next();
                if (nq.done) {
                    $('#option button#review').removeAttr('disabled');
                    clearInterval(reviewal_id);
                    timer.text(savedTime);
                    return;
                }
                q = $(nq.value);
                q.addClass('now');
            }
        }, 50);
    });
});
