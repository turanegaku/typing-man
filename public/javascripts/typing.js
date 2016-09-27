/* global $ moment document window */

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

    // get cookie name
    const cookies = {};
    document.cookie.split('; ').forEach(c => {
        const str = c.split('=');
        cookies[str[0]] = str[1];
    });
    // =============== ready for start =============== //

    const questions = $('#question span:not(:has(*))'); // all of char

    const miss  = $('#miss');                           // collection for misstype chars
    const rank  = $('#rank');                        // record ranking
    const error = $('#error .value');                   // typo cunter
    const timer = $('#time .value');                    // timer

    let itr_question;   // iterator for all of char
    let question;       // now char should type

    let step;
    let start_time;
    let interval_id;
    let reviewal_id;

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
        rank.find('li.my').removeClass('my');
    }

    function updateTimer() {
        const t = moment(moment() - start_time).format('mm:ss.SS');
        timer.text(t);
    }

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
        const my_error  = error.text();
        const my = $('<li>', {'class': 'my'})
        .append(
            $('<div>', {
                'text': my_result.text(),
                'class': 'inline-2 time'
            })
        )
        .append(
            $('<div>', {
                'text': my_error,
                'class': 'inline-2 time'
            })
        );
        let best = false;
        const ranks = rank.find('ol > li');
        ranks.each((i, r) => {
            const result = $(r);
            const record = moment(result.children('.time').text(), 'mm:ss.SS');
            const error = $(r).children('.error');
            console.log(my_record < record, my_record - record === 0, +my_error <= +error.text());
            if (my_record < record || my_record - record === 0 && +my_error <= +error.text()) {
                step |= TYPING;
                my.prepend(
                    $('<div>', {'class': 'inline-2 name'})
                    .append($('<span>', {
                        'text': ' ',
                        'class': 'enter now',
                    }))
                    .append($('<span>', {
                        'text': 'your name.',
                        'class': 'yet'
                    }))
                );
                my.insertBefore(result)
                .hide().show(500);
                best = true;

                ranks.last().hide(500, () => ranks.last().remove());

                if (cookies.name) {
                    for (let i = 0; i < cookies.name.length; ++i) {
                        rank.find('ol > li.my .name .enter').before(
                            $('<span>', {'text': cookies.name[i]})
                        );
                    }
                }

                $('#option button#restart').attr('disabled', 'disabled');

                return false;
            }
        });
        if (!best) {
            my.prepend($('<div>', {'class': 'inline-2 name yet', 'text': 'your record'}))
            .insertAfter(ranks.last())
            .delay(3000)
            .hide(1000, () => my.remove());

            $.ajax({
                'type': 'POST',
                'dataType': 'text',
                'data': {'name': cookies.name, 'time': timer.text(), 'error': error.text()},
            });

            $('#option button#review').removeAttr('disabled');
        }

        if (rank.offset().top + rank.height() > $(window).height()) {
            $('body,html').animate({'scrollTop': rank.offset().top}, 800, 'swing');
        }
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
        if (e.which == 0) {
            return true;
        }
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
                    if (!miss.children().length && question.next().length) {
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
                const name = rank.find('ol > li.my .name');
                if (isback(e)) {
                    if (name.children(':not(.enter):not(.yet)').length) {
                        name.children(':not(.enter):not(.yet)').last().remove();    // delete miss
                    }
                } else if (isnl(e)) {
                    step &= ~TYPING;
                    name.children('.enter, .yet').remove();    // delete miss
                    $.ajax({
                        'type': 'POST',
                        'dataType': 'text',
                        'data': {'name': name.text(), 'time': timer.text(), 'error': error.text()},
                        'error': (err) => {
                            const message = $('<p>', {'text': 'BadRequest!!'});
                            message.insertAfter($('#info p').last())
                            .hide().show(500)
                            .delay(1000, () =>
                                   rank.find('ol > li.my').css({'color': 'lightgrey'}))
                            .hide(200, () => message.remove());
                        }
                    });

                    $('#option button').removeAttr('disabled');
                } else if (name.children(':not(.enter):not(.yet)').length < 12) {
                    name.children('.enter').before(
                        $('<span>', {'text': String.fromCharCode(e.which)})
                    );
                }
            }
        }


        console.log(e.which);
        if (step & TYPING) {
            if (isignore(e)) { // space, slash
                return false;
            }
        }
    });

    $('#option button#restart').click(() => {
        initialize();
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
});

