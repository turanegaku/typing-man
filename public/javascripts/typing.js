/* global $ moment window location io */

$(() => {
    // =============== constant =============== //
    const CLEAN  = 0;
    const TYPING = 1 << 0;
    const FINISH = 1 << 1;


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


    let username = $('header .username').text();


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

    $('html').keydown(e => {
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
                    $('#option button').removeAttr('disabled');
                    const out = rank.find('ol > li.my.out');
                    out.hide(200, () => out.remove());
                    rank.find('li.my').removeClass('my');
                    return false;
                }
            }
        }
    });

    $('html').keypress(e => {
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

