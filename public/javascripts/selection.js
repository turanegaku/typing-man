/* global $ location */

$(() => {
    // =============== useful function =============== //
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
    // wrap all char in selection with span
    $('#selection :not(:has(p))').contents()
    .filter((_, t) => {
        return t.nodeType === 3;
    }).each((i, txt) => {
        $(txt).replaceWith($(txt).text()
                           .replace(/(.)/g, '<span>$1</span>'));
    });


    const sel_f = $('#selection a > span:first-child');
    const sel_l = $('#selection a > span:last-child');

    sel_f.before($('<span>', {'class': 'done'}));
    sel_l.after ($('<span>', {'class': 'done'}));

    const selections = sel_f;
    const all = $('#selection a > span');

    selections.each((i, q) => {
        let selection = $(q);
        const parent = selection.parent();
        const siblings = parent.children();

        $('html').keypress((e) => {
            if (isback(e)) {
                if (selection.prev().prev().length) {
                    parent.removeAttr('href');
                    all.removeClass('movable');

                    selection = selection.prev();
                    selection.removeClass('done');
                }
            } else if (selection.text() === String.fromCharCode(e.which)) {
                selection.addClass('done');
                selection = selection.next();

                if (!selection.next().length) {              // done sentence
                    parent.attr('href', parent.text());     // click able
                    all.removeClass('movable');        // remove other
                    siblings.addClass('movable');           // add self
                }
            }

            if (isignore(e)) {
                return false;
            }
        });
    });

    $('html').keypress((e) => {
        const link = $('#selection a:has(span.movable)');
        if (isnl(e) && link.length) {
            location.href = link.text();
        }
    });
});

