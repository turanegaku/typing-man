/* global $ location */

$(() => {
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
                           .replace(/(.)/g, '<span>$1</span>'));
    });

    const questions = $('#question a > span:first-child');
    questions.css({'text-decoration': 'underline'});

    questions
    .before('<span></span>');
    $('#question a span:last-child')
    .after('<span></span>');

    questions.each((i, q) => {
        let question = $(q);
        const parent = question.parent();
        const siblings = parent.children();

        $('html').keypress((e) => {
            if (question.text() === String.fromCharCode(e.which)) {
                question.addClass('done');
                question = question.next();
                question.css({'text-decoration': 'underline'});

                if (!question.next().length) {              // done sentence
                    parent.attr('href', parent.text());     // click able
                    siblings.removeClass('movable');        // remove other
                    siblings.addClass('movable');           // add self
                }
            }

            if (isback(e)) {
                if (question.prev().prev().length) {
                    parent.removeAttr('href');
                    siblings.removeClass('movable');

                    question.css({'text-decoration': 'none'});
                    question = question.prev();
                    question.removeClass('done');
                }
                return false;   // avoid page back
            }
        });
    });

    $('html').keypress((e) => {
        const link = $('#question a:has(span.movable)');
        if (isnl(e) && link.length) {
            location.href = link.text();
        }
    });
});

