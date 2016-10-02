/* global $ io moment location document window */

$(() => {
    // =============== constant =============== //
    const CLEAN  = 0;
    const TYPING = 1 << 0;
    const FINISH = 1 << 1;

    const layout_q2d = {
        33: 33,   /* !! */ 34: 95,   /* "_ */ 35: 35,   /* ## */ 36: 36,   /* $$ */
        37: 37,   /* %% */ 38: 38,   /* && */ 39: 45,   /* '- */ 40: 40,   /* (( */
        41: 41,   /* )) */ 42: 42,   /* ** */ 43: 125,  /* =} */ 44: 119,  /* ,w */
        45: 91,   /* -[ */ 46: 118,  /* .v */ 47: 122,  /* /z */ 48: 48,   /* 00 */
        49: 49,   /* 11 */ 50: 50,   /* 22 */ 51: 51,   /* 33 */ 52: 52,   /* 44 */
        53: 53,   /* 55 */ 54: 54,   /* 66 */ 55: 55,   /* 77 */ 56: 56,   /* 88 */
        57: 57,   /* 99 */ 58: 83,   /* :S */ 59: 115,  /* ;s */ 60: 87,   /* <W */
        61: 93,   /* =] */ 62: 86,   /* >V */ 63: 90,   /* ?Z */ 64: 64,   /* @@ */
        65: 65,   /* AA */ 66: 88,   /* BX */ 67: 74,   /* CJ */ 68: 69,   /* DE */
        69: 62,   /* E> */ 70: 85,   /* FU */ 71: 73,   /* GI */ 72: 68,   /* HD */
        73: 67,   /* IC */ 74: 72,   /* JH */ 75: 84,   /* KT */ 76: 78,   /* LN */
        77: 77,   /* MM */ 78: 66,   /* NB */ 79: 82,   /* OR */ 80: 76,   /* PL */
        81: 34,   /* Q" */ 82: 80,   /* RP */ 83: 79,   /* SO */ 84: 89,   /* TY */
        85: 71,   /* UG */ 86: 75,   /* VK */ 87: 60,   /* W< */ 88: 81,   /* XQ */
        89: 70,   /* YF */ 90: 58,   /* Z: */ 91: 47,   /* [/ */ 92: 92,   /* \\ */
        93: 61,   /* ]= */ 94: 94,   /* ^^ */ 95: 123,  /* _{ */ 97: 97,   /* aa */
        98: 120,  /* bx */ 99: 106,  /* cj */ 100: 101, /* de */ 101: 46,  /* e. */
        102: 117, /* fu */ 103: 105, /* gi */ 104: 100, /* hd */ 105: 99,  /* ic */
        106: 104, /* jh */ 107: 116, /* kt */ 108: 110, /* ln */ 109: 109, /* mm */
        110: 98,  /* nb */ 111: 114, /* or */ 112: 108, /* pl */ 113: 39,  /* q' */
        114: 112, /* rp */ 115: 111, /* so */ 116: 121, /* ty */ 117: 103, /* ug */
        118: 107, /* vk */ 119: 44,  /* w, */ 120: 113, /* xq */ 121: 102, /* yf */
        122: 59,  /* z; */ 123: 63,  /* {? */ 124: 124, /* || */ 125: 43,  /* }+ */
    };
    const layout_q2c = {
        33: 33,   /* !! */ 34: 95,   /* "_ */ 35: 35,   /* ## */ 36: 36,   /* $$ */
        37: 37,   /* %% */ 38: 38,   /* && */ 39: 45,   /* '- */ 40: 40,   /* (( */
        41: 41,   /* )) */ 42: 42,   /* ** */ 43: 43,   /* == */ 44: 44,   /* ,, */
        45: 45,   /* -- */ 46: 46,   /* .. */ 47: 47,   /* // */ 48: 48,   /* 00 */
        49: 49,   /* 11 */ 50: 50,   /* 22 */ 51: 51,   /* 33 */ 52: 52,   /* 44 */
        53: 53,   /* 55 */ 54: 54,   /* 66 */ 55: 55,   /* 77 */ 56: 56,   /* 88 */
        57: 57,   /* 99 */ 58: 79,   /* :O */ 59: 111,  /* ;o */ 60: 60,   /* << */
        61: 61,   /* == */ 62: 62,   /* >> */ 63: 63,   /* ?? */ 64: 64,   /* @@ */
        65: 65,   /* AA */ 66: 66,   /* BB */ 67: 67,   /* CC */ 68: 83,   /* DS */
        69: 70,   /* EF */ 70: 84,   /* FT */ 71: 68,   /* GD */ 72: 72,   /* HH */
        73: 85,   /* IU */ 74: 78,   /* JN */ 75: 69,   /* KE */ 76: 73,   /* LI */
        77: 77,   /* MM */ 78: 75,   /* NK */ 79: 89,   /* OY */ 80: 80,   /* PP */
        81: 81,   /* QQ */ 82: 80,   /* RP */ 83: 82,   /* SR */ 84: 71,   /* TG */
        85: 76,   /* UL */ 86: 86,   /* VV */ 87: 87,   /* WW */ 88: 88,   /* XX */
        89: 74,   /* YJ */ 90: 90,   /* ZZ */ 91: 91,   /* [[ */ 92: 92,   /* \\ */
        93: 93,   /* ]] */ 94: 94,   /* ^^ */ 95: 95,   /* __ */ 97: 97,   /* aa */
        98: 98,   /* bb */ 99: 99,   /* cc */ 100: 105, /* ds */ 101: 102, /* ef */
        102: 116, /* ft */ 103: 100, /* gd */ 104: 104, /* hh */ 105: 117, /* iu */
        106: 110, /* jn */ 107: 101, /* ke */ 108: 106, /* li */ 109: 109, /* mm */
        110: 107, /* nk */ 111: 121, /* oy */ 112: 112, /* pp */ 113: 113, /* qq */
        114: 112, /* rp */ 115: 114, /* sr */ 116: 103, /* tg */ 117: 108, /* ul */
        118: 118, /* vv */ 119: 119, /* ww */ 120: 120, /* xx */ 121: 106, /* yj */
        122: 122, /* zz */ 123: 123, /* {{ */ 124: 124, /* || */ 125: 125, /* }} */
    };

    // =============== useful function =============== //
    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function isnl(e) {
        if (e.which === 13) {
            return true;
        }
        if (e.ctrlKey && (e.which === 77 || e.which === 109)) {
            return true;
        }
        return false;
    }
    function isback(e) {
        if (e.which === 8) {
            return true;
        }
        if (e.ctrlKey && (e.which === 72 || e.which === 104)) {
            return true;
        }
        return false;
    }
    function isignore(e) {
        return e.which === 8    // bs
            || e.which === 32   // space
            || e.which === 39   // quote
            || e.which === 47;  // slash
    }

    $(document).keypress(e => {
        switch ($('header form#layout :checked').val()) {
        case 'Dvorak':
            e.which = layout_q2d[e.which];
            break;
        case 'Colemak':
            e.which = layout_q2c[e.which];
            break;
        default:
        }
        console.log(String.fromCharCode(e.which));
    });


    // =============== ready for start =============== //
    // wrap all char in question with span
    $('#question :not(:has(p))').contents()
    .filter((_, t) => {
        return t.nodeType === 3;
    }).each((i, txt) => {
        $(txt).replaceWith($(txt).text()
                           .replace(/(.)/g, '<span>$1</span>')
                           .replace(/<span>-<\/span>\n/g, '<span class="skip">-</span>\n'));
                           // '-' which is end of line may be connection word
    });

    // append enter dummy span after end of sentence
    $('#question span:last-child')
    .after('<span class="enter"> </span>');

    let username = $.cookie('name');


    // =============== main function =============== //
    const questions = $('#question span:not(:has(*))'); // all of char

    const miss  = $('#miss');                           // collection for misstype chars
    const rank  = $('#rank');                        // record ranking
    const error = $('#error .value');                   // typo cunter
    const timer = $('#time .value');                    // timer

    let itr_question;   // iterator for all of char
    let question;       // now char should type

    let step;
    let start_time;
    let end_time;
    let interval_id;
    let reviewal_id;

    const appeal = $('<div>', {'class': 'ring'});

    initialize();

    function initialize() {
        step = CLEAN;

        clearInterval(interval_id);
        clearInterval(reviewal_id);
        start_time = moment();
        updateTimer();

        questions.removeClass('done miss now');
        questions.css('opacity', '');

        itr_question = questions[Symbol.iterator]();  // iterator for all of char
        question = $(itr_question.next().value);        // now char should type
        question.addClass('now');

        miss.children().remove();
        error.text('0');

        $('#option button#review').attr('disabled', 'disabled');
        $('#option button#restart').removeAttr('disabled');
        question.append(appeal);
    }

    function updateTimer() {
        end_time = moment();
        timer.text(moment(end_time - start_time).format('mm:ss.SS'));
    }

    function start_type() {
        step |= TYPING;
        start_time = moment();
        interval_id = setInterval(updateTimer, 50);
        appeal.remove();
    }

    function finish_type() {
        step |= FINISH;
        clearInterval(interval_id);
        updateTimer();
        questions.animate({'opacity': 1}, 'slow', 'easeInQuad');
        $('#option button#restart').attr('disabled', 'disabled');

        const name = new Array();
        if (username) {
            for (let i = 0; i < username.length; ++i) {
                name.push(
                    $('<span>', {'text': username[i]})
                );
            }
        }
        name.push($('<span>', {
            'text': ' ',
            'class': 'enter now',
        }));
        name.push($('<span>', {
            'text': 'your name.',
            'class': 'yet'
        }));

        const my = newRecord({
            'name': name,
            'time': end_time - start_time,
            'error': +error.text(),
        }, true);
        if (my.hasClass('out')) {
            my.insertAfter(rank.find('ol > li').last())
            .hide().show(500);
        }

        if (rank.offset().top + rank.height() > $(window).height()) {
            $('body,html').animate({'scrollTop': rank.offset().top}, 800, 'swing');
        }
    }

    function newRecord(result, my) {
        const dom = $('<li>')
        .append(
            $('<div>', {
                'class': 'inline-2 name'
            })
            .append(result.name)
        )
        .append(
            $('<div>', {
                't': result.time,
                'text': moment(+result.time).format('mm:ss.SS'),
                'class': 'inline-2 time'
            })
        )
        .append(
            $('<div>', {
                'text': result.error,
                'class': 'inline-2 time'
            })
        );
        if (my) {
            dom.addClass('my');
        }

        let best = false;
        const ranks = rank.find('ol > li:not(.out)');
        console.log(ranks);
        ranks.each((i, r) => {
            const record = $(r);
            const time = record.children('.time').attr('t');
            const error = record.children('.error');
            if (result.time < time || result.time - time === 0 && +result.error <= +error.text()) {
                dom.insertBefore(record)
                .hide().show(500);
                best = true;

                ranks.last()
                .addClass('out')
                .hide(500, () => ranks.last().remove());


                return false;
            }
        });
        if (!best) {
            dom.addClass('out');
        }
        return dom;
    }

    function nextChar() {
        question.attr('time', moment() - start_time);
        question.addClass('done');
        question.removeClass('now');

        const dx = getRandomArbitary(-30, +30);
        const dy = getRandomArbitary(250, 350);
        const q = question.clone();
        const p = question.position();
        q.css({'left': p.left, 'top': p.top})
        .appendTo('#drop')
        .animate({'left': '+=' + dx + 'px'}, {
            'duration': 1000,
            'queue': false
        })
        .animate({'top': '+=' + dy + 'px'}, {
            'duration': 1000,
            'queue': false,
            'easing': 'easeInOutBack'
        })
        .fadeOut(700, 'easeInCubic', () => {q.remove();});

        question.css({'opacity': 0.1});

        const nq = itr_question.next();
        if (nq.done) {
            finish_type();
        }
        question = $(nq.value);
        question.addClass('now');
        if (question.hasClass('skip')) {
            nextChar();
        }
    }

    $(document).keydown(e => {
        if (step & TYPING) {
            if (!(step & FINISH)) {
                if (isback(e)) {
                    if (miss.children().length) {
                        miss.children().last().remove();    // delete miss
                    }
                    return false;
                } else if (isnl(e)) {
                    if (!miss.children().length && !question.next().length) {
                        nextChar();
                    }
                    return false;
                }
            } else {
                const name = rank.find('ol > li.my .name');
                if (isback(e)) {
                    if (name.children(':not(.enter):not(.yet)').length) {
                        name.children(':not(.enter):not(.yet)').last().remove();    // delete miss
                    }
                    return false;
                } else if (isnl(e)) {
                    step &= ~TYPING;
                    name.children('.enter, .yet').remove();
                    $.ajax({
                        'type': 'POST',
                        'dataType': 'text',
                        'data': {
                            'id': socket.id,
                            'name': name.text(),
                            'time': end_time - start_time,
                            'error': error.text()
                        },
                        'error': (err) => {
                            const message = $('<p>', {'text': 'BadRequest!!'});
                            message.insertAfter($('#info p').last())
                            .hide().show(500)
                            .delay(1000, () =>
                                   rank.find('ol > li.my').css({'color': 'lightgrey'}))
                            .hide(200, () => message.remove());
                        }
                    });

                    username = name.text();
                    $.cookie('name', username);
                    $('#option button').removeAttr('disabled');
                    const out = rank.find('ol > li.my.out');
                    out.hide(200, () => out.remove());
                    rank.find('li.my').removeClass('my');
                    return false;
                }
            }
        }
    });

    $(document).keypress(e => {
        if (e.which == 0) {
            return true;
        }
        if (step === CLEAN && !isignore(e)) {
            start_type();
        }

        if (step & TYPING) {
            if (!(step & FINISH)) {
                if (question.text() === String.fromCharCode(e.which)) {     // incorrect type
                    if (!miss.children().length && question.next().length) {
                        nextChar();
                    }
                } else {                                                    // incorrect type
                    error.text(+error.text() + 1);                          // increment miss count
                    question.addClass('miss');

                    const p = question.position();
                    miss.css({'left': p.left, 'top': p.top})                        // set position
                    .append(question.clone().text(String.fromCharCode(e.which)));   // add miss
                }
            } else {
                const name = rank.find('ol > li.my .name');
                if (name.children(':not(.enter):not(.yet)').length < 12) {
                    name.children('.enter').before(
                        $('<span>', {'text': String.fromCharCode(e.which)})
                    );
                }
            }
        }


        if (step & TYPING) {
            if (isignore(e)) { // space, slash
                return false;
            }
        }
    });

    $('#option button#restart').click(() => {
        initialize();
        question.focus();
    });

    $('#option button#review').click(() => {
        $('#option button#review').attr('disabled', 'disabled');
        start_time = moment();
        questions.removeClass('done');

        const itr = questions[Symbol.iterator]();  // iterator for all of char
        let q = $(itr.next().value);        // now char should type
        q.addClass('now');

        const t = timer.text();

        reviewal_id = setInterval(() => {
            updateTimer();
            if (+q.attr('time') < moment() - start_time) {
                q.addClass('done');
                q.removeClass('now');
                const nq = itr.next();
                if (nq.done) {
                    $('#option button#review').removeAttr('disabled');
                    clearInterval(reviewal_id);
                    timer.text(t);
                }
                q = $(nq.value);
                q.addClass('now');
            }
        }, 50);
    });

    const socket = io.connect();
    socket.on('record:new', data => {
        if (data.id !== socket.id) {
            data.time = +data.time;
            newRecord(data, false);
        }
    });
});

