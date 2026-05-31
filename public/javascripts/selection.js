/* global $ localStorage location */

$(() => {
    // ── utility ────────────────────────────────────────────────
    function isnl(e) {
        return e.which === 13 || (e.ctrlKey && (e.which === 77 || e.which === 109));
    }
    function isback(e) {
        return e.which === 8 || (e.ctrlKey && (e.which === 72 || e.which === 104));
    }
    function isignore(e) {
        return e.which === 8 || e.which === 32 || e.which === 39 || e.which === 47;
    }

    // ── 問題テキストを span に分割 ─────────────────────────────
    $('#selection :not(:has(p)):not(.nt)').contents()
    .filter((_, t) => t.nodeType === 3)
    .each((_, txt) => {
        $(txt).replaceWith($(txt).text().replace(/(.)/g, '<span>$1</span>'));
    });

    // ── 選択 UI ────────────────────────────────────────────────
    const sel_f = $('#selection a > span:first-child');
    const sel_l = $('#selection a > span:last-child');

    sel_f.before($('<span>', { class: 'done' }));
    sel_l.after ($('<span>', { class: 'done' }));

    const selections = sel_f;
    const all = $('#selection a');

    selections.each((_, q) => {
        let selection = $(q);
        const parent = selection.parent();

        $('html').keydown(e => {
            if (isback(e)) {
                if (selection.prev().prev().length) {
                    parent.removeAttr('href');
                    all.removeClass('movable');
                    selection = selection.prev();
                    selection.removeClass('done');
                }
                return false;
            }
        });

        $(document).keypress(e => {
            if (selection.text() === String.fromCharCode(e.which)) {
                selection.addClass('done');
                selection = selection.next();

                if (!selection.next().length) {
                    parent.attr('href', targetPrefix + encodeURIComponent(parent.data('command') || parent.text()));
                    all.removeClass('movable');
                    parent.addClass('movable');
                }
            }
            if (isignore(e)) return false;
        });
    });

    let holder_id = setTimeout(() => $('.holder').addClass('visible'), 5000);
    $(document).keydown(() => {
        $('.holder.visible').removeClass('visible');
        clearInterval(holder_id);
        holder_id = setTimeout(() => $('.holder').addClass('visible'), 5000);
    });
    $(document).keydown(e => {
        const link = $('#selection a.movable');
        if (isnl(e)) {
            if (link.length) location.href = link.attr('href') || (targetPrefix + encodeURIComponent(link.data('command') || link.text()));
            return false;
        }
    });
});
