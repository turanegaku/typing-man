/* global $ moment */

$(() => {
    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function updateTimer() {
        const t = moment(moment() - start_time).format('mm:ss.SS');
        $('#time .value').text(t);
    }


    $('#question :not(:has(p))').contents()
    .filter((_, t) => {
        return t.nodeType === 3;
    }).each((i, txt) => {
        $(txt).replaceWith($(txt).text()
                           .replace(/(.)/g, '<span>$1</span>')
                           .replace(/<span>-<\/span>\n/g, '<span class="skip">-</span>\n'));
    });

    const questions = $('#question span:not(:has(*))');
    const itr_question = questions[Symbol.iterator]();
    let question = $(itr_question.next().value);
    question.css({'text-decoration': 'underline'});
    let starting = false;
    let start_time;
    let interval_id;

    function nextChar() {
        question.addClass('done');
        question.css({'text-decoration': 'none'});

        const dx = getRandomArbitary(-30, +30);
        const q = question.clone();
        const p = question.position();
        q.css({'position': 'absolute', 'left': p.left, 'top': p.top})
        .css({'font-size': '+=10px'})
        .insertAfter($('#drop'))
        .animate({'left': '+=' + dx + 'px'}, {
            'duration': 800,
            'queue': false
        })
        .animate({'top': '+=600px'}, {
            'duration': 800,
            'queue': false,
            'easing': 'easeInOutCubic'
        })
        .fadeOut(800, () => {q.remove();});

        question.css({'opacity': 0.1});

        const nq = itr_question.next();
        if (nq.done) {
            updateTimer();

            questions.animate({'opacity': 1}, 'slow', 'easeInQuad');
            clearInterval(interval_id);
        }
        question = $(nq.value);
        question.css({'text-decoration': 'underline'});
        if (question.hasClass('skip')) {
            nextChar();
        }
    }

    function isnl(e) {
        if (e.which == 13) {
            return true;
        }
        if (e.ctrlKey) {
            if (e.which == 106 || e.which == 109) {
                return true;
            }
        }
        return false;
    }

    $('html').keypress((e) => {
        if (!starting) {
            starting = true;
            start_time = moment();
            interval_id = setInterval(updateTimer, 50);
        }
        if (question.next().length && question.text() === String.fromCharCode(e.which)
            || !question.next().length && isnl(e)) { // correct type
            nextChar();
        } else { // incorrect type
            $('#error .value').text(+$('#error .value').text() + 1);
            question.addClass('miss');

            const q = question.clone();
            const p = question.position();
            q
            .text(String.fromCharCode(e.which))
            .css({'position': 'absolute', 'left': p.left, 'top': p.top})
            .css({'font-size': '+=10px', 'text-decoration': 'none', 'color': 'blue'})
            .insertAfter($('#drop'))
            .animate({'top': '-=50px'}, {'queue': false, 'easing': 'easeInOutCubic'})
            .fadeOut(1000, () => {q.remove();});
        }

        if (e.which === 32) {
            return false;
        }
    });
});

