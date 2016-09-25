/* global $ moment */

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
        if (e.ctrlKey && e.which === 109) {
            return true;
        }
        return false;
    }
    function isback(e) {
        if (e.which === 8) {
            return true;
        }
        if (e.ctrlKey && e.which === 104) {
            return true;
        }
        return false;
    }
    function isignore(e) {
        return e.which === 8 || e.which === 32 || e.which == 47; // space, slash
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
    // =============== ready for start =============== //

    const questions = $('#question span:not(:has(*))'); // all of char
    const itr_question = questions[Symbol.iterator]();  // iterator for all of char
    const miss = $('#miss');                            // collection for misstype chars

    const error = $('#error .value');
    const timer = $('#time .value');

    function updateTimer() {
        const t = moment(moment() - start_time).format('mm:ss.SS');
        timer.text(t);
    }


    let question = $(itr_question.next().value);        // now char should type
    question.addClass('now');

    let step = CLEAN;
    let start_time;
    let interval_id;

    function start_type() {
        step |= TYPING;
        start_time = moment();
        interval_id = setInterval(updateTimer, 50);
    }

    function finish_type() {
        step |= FINISH;
        step &= ~TYPING;
        clearInterval(interval_id);
        updateTimer();
        questions.animate({'opacity': 1}, 'slow', 'easeInQuad');

        const my_result = $('#time .value');
        const my_record = moment(my_result.text(), 'mm:ss.SS');
        const ranks = $('#rank ol > li .time');
        ranks.each((i, r) => {
            const result = $(r);
            const record = moment(result.text(), 'mm:ss.SS');
            if (my_record <= record) {
                step |= TYPING;
                console.log(i, record);
                $('<li>')
                .addClass('my')
                .append(
                    $('<div>', {'class': 'inline-3 name'})
                    .append($('<span>', {
                        'text': ' ',
                        'class': 'enter now',
                    }))
                    .append($('<span>', {
                        'text': 'your name.',
                        'class': 'yet'
                    }))
                )
                .append(
                    $('<div>', {
                        'text': my_result.text(),
                        'class': 'inline-3 time'
                    })
                )
                .insertBefore(result.parent())
                .hide().show(500);

                ranks.last().hide(500);

                return false;
            }
        });
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

    $('html').keypress((e) => {
        if (step === CLEAN && !isignore(e)) {
            start_type();
        }

        if (step & TYPING) {
            if (!(step & FINISH)) {
                if (isback(e)) {
                    if (miss.children().length) {
                        miss.children().last().remove();    // delete miss
                    }
                } else if (isnl(e)) {
                    if (!question.next().length) {
                        nextChar();
                    }
                } else if (question.text() === String.fromCharCode(e.which)) {   // incorrect type
                    if (!miss.children().length) {
                        nextChar();
                    }
                } else {                                // incorrect type
                    error.text(+error.text() + 1);              // increment miss count
                    question.addClass('miss');

                    const p = question.position();
                    miss.css({'left': p.left, 'top': p.top})                        // set position
                    .append(question.clone().text(String.fromCharCode(e.which)));   // add miss
                }
            } else {
                const name = $('#rank ol > li.my .name');
                if (isback(e)) {
                    if (name.children(':not(.enter):not(.yet)').length) {
                        name.children(':not(.enter):not(.yet)').last().remove();    // delete miss
                    }
                } else if (isnl(e)) {
                    step &= ~TYPING;
                    name.children('.enter, .yet').remove();    // delete miss
                    console.log(name.children().text(), timer.text());
                    $.ajax({
                        'type': 'POST',
                        'dataType': 'json',
                        'data': {'name': name.text(), 'time': timer.text()},
                        'error': (err) => {
                            console.error(err);
                        }
                    });
                } else if (name.children(':not(.enter):not(.yet)').length < 12) {
                    name.children('.enter').before(
                        $('<span>', {'text': String.fromCharCode(e.which)})
                    );
                }
            }
        }

        if (step & TYPING) {
            if (e.which === 39) {
                return false;
            }
            if (isignore(e)) { // space, slash
                // console.log('ignore', e.which);
                return false;
            }
        }
    });
});

