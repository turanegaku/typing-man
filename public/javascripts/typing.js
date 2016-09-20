/* global $ moment */

$(() => {
    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function updateTimer() {
        const t = moment(moment() - start_time).format('mm:ss.SS');
        $('#time .value').text(t);
    }
    function isnl(e) {
        if (e.which == 13) {
            return true;
        }
        if (e.ctrlKey && e.which == 109) {
            return true;
        }
        return false;
    }
    function isback(e) {
        if (e.which == 8) {
            return true;
        }
        if (e.ctrlKey && e.which == 104) {
            return true;
        }
        return false;
    }


    $('#question :not(:has(p))').contents()
    .filter((_, t) => {
        return t.nodeType === 3;
    }).each((i, txt) => {
        $(txt).replaceWith($(txt).text()
                           .replace(/(.)/g, '<span>$1</span>')
                           .replace(/<span>-<\/span>\n/g, '<span class="skip">-</span>\n'));
    });

    $('#question span:last-child')
    .after('<span class="enter"> </span>');

    const questions = $('#question span:not(:has(*))');
    const itr_question = questions[Symbol.iterator]();
    let question = $(itr_question.next().value);
    question.css({'text-decoration': 'underline'});

    const miss = $('#miss');

    let starting = false;
    let finish = false;
    let start_time;
    let interval_id;

    function nextChar() {
        question.addClass('done');
        question.css({'text-decoration': 'none'});

        const dx = getRandomArbitary(-30, +30);
        const dy = getRandomArbitary(650, 750);
        const q = question.clone();
        const p = question.position();
        q.css({'left': p.left, 'top': p.top})
        .appendTo('#drop')
        .animate({'left': '+=' + dx + 'px'}, {
            'duration': 1000,
            'queue': false
        })
        .animate({'top': '+=300px'}, {
            'duration': 1000,
            'queue': false,
            'easing': 'easeInOutBack'
        })
        .fadeOut(700, 'easeInCubic', () => {q.remove();});

        question.css({'opacity': 0.1});

        const nq = itr_question.next();
        if (nq.done) { // finish all
            updateTimer();
            finish = true;

            questions.animate({'opacity': 1}, 'slow', 'easeInQuad');
            clearInterval(interval_id);
        }
        question = $(nq.value);
        question.css({'text-decoration': 'underline'});
        if (question.hasClass('skip')) {
            nextChar();
        }
    }

    $('html').keypress((e) => {
        if (!starting) {
            starting = true;
            start_time = moment();
            interval_id = setInterval(updateTimer, 50);
        }

        if (!finish) {
            if (isback(e)) { // delete miss
                if (miss.children().length) {
                    miss.children().last().remove();
                }
            } else if (!miss.children().length
                   && (question.next().length && question.text() === String.fromCharCode(e.which)
                   || !question.next().length && isnl(e))) { // correct type
                nextChar();
            } else { // incorrect type
                $('#error .value').text(+$('#error .value').text() + 1);
                question.addClass('miss');

                const q = question.clone();
                const p = question.position();
                miss.css({'left': p.left, 'top': p.top});
                q
                .text(String.fromCharCode(e.which))
                .css({'text-decoration': 'none'})
                .appendTo(miss);
            }
        }

        if (e.which == 8 || e.which == 39) {
            return false;
        }
    });
});

