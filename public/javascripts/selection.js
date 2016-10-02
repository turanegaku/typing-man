/* global $ location document */

$(() => {
    // =============== constant =============== //
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
    // const layout_j2u = {
    //     33: 33,   /* !! */ 34: 34,   /* "" */ 35: 35,   /* ## */ 36: 36,   /* $$ */
    //     37: 37,   /* %% */ 38: 38,   /* && */ 39: 39,   /* '' */ 40: 40,   /* (( */
    //     41: 41,   /* )) */ 42: 42,   /* ** */ 43: 43,   /* == */ 44: 44,   /* ,, */
    //     45: 45,   /* -- */ 46: 46,   /* .. */ 47: 47,   /* // */ 48: 48,   /* 00 */
    //     49: 49,   /* 11 */ 50: 50,   /* 22 */ 51: 51,   /* 33 */ 52: 52,   /* 44 */
    //     53: 53,   /* 55 */ 54: 54,   /* 66 */ 55: 55,   /* 77 */ 56: 56,   /* 88 */
    //     57: 57,   /* 99 */ 58: 58,   /* :: */ 59: 59,   /* ;; */ 60: 60,   /* << */
    //     61: 61,   /* == */ 62: 62,   /* >> */ 63: 63,   /* ?? */ 64: 64,   /* @@ */
    //     65: 65,   /* AA */ 66: 66,   /* BB */ 67: 67,   /* CC */ 68: 68,   /* DD */
    //     69: 69,   /* EE */ 70: 70,   /* FF */ 71: 71,   /* GG */ 72: 72,   /* HH */
    //     73: 73,   /* II */ 74: 74,   /* JJ */ 75: 75,   /* KK */ 76: 76,   /* LL */
    //     77: 77,   /* MM */ 78: 78,   /* NN */ 79: 79,   /* OO */ 80: 80,   /* PP */
    //     81: 81,   /* QQ */ 82: 82,   /* RR */ 83: 83,   /* SS */ 84: 84,   /* TT */
    //     85: 85,   /* UU */ 86: 86,   /* VV */ 87: 87,   /* WW */ 88: 88,   /* XX */
    //     89: 89,   /* YY */ 90: 90,   /* ZZ */ 91: 91,   /* [[ */ 92: 92,   /* \\ */
    //     93: 93,   /* ]] */ 94: 94,   /* ^^ */ 95: 95,   /* __ */ 97: 97,   /* aa */
    //     98: 98,   /* bb */ 99: 99,   /* cc */ 100: 100, /* dd */ 101: 101, /* ee */
    //     102: 102, /* ff */ 103: 103, /* gg */ 104: 104, /* hh */ 105: 105, /* ii */
    //     106: 106, /* jj */ 107: 107, /* kk */ 108: 108, /* ll */ 109: 109, /* mm */
    //     110: 110, /* nn */ 111: 111, /* oo */ 112: 112, /* pp */ 113: 113, /* qq */
    //     114: 114, /* rr */ 115: 115, /* ss */ 116: 116, /* tt */ 117: 117, /* uu */
    //     118: 118, /* vv */ 119: 119, /* ww */ 120: 120, /* xx */ 121: 121, /* yy */
    //     122: 122, /* zz */ 123: 123, /* {{ */ 124: 124, /* || */ 125: 125, /* }} */
    // };


    // =============== useful function =============== //
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
    // wrap all char in selection with span
    $('#selection :not(:has(p)):not(.nt)').contents()
    .filter((_, t) => {
        return t.nodeType === 3;
    }).each((i, txt) => {
        $(txt).replaceWith($(txt).text()
                           .replace(/(.)/g, '<span>$1</span>'));
    });

    $(document).keypress(e => {
        const keyboard = $('header form#layout [name=keyboard]:checked');
        switch ($('header form#layout [name=layout]:checked').val()) {
        case 'Dvorak':
            // if (keyboard === 'JIS') {
            //     e.which = layout_j2u[e.which];
            // }
            e.which = layout_q2d[e.which];
            break;
        case 'Colemak':
            // if (keyboard === 'JIS') {
            //     e.which = layout_j2u[e.which];
            // }
            e.which = layout_q2c[e.which];
            break;
        default:
        }
        console.log(String.fromCharCode(e.which));
    });


    // =============== main function =============== //
    const sel_f = $('#selection a > span:first-child');
    const sel_l = $('#selection a > span:last-child');

    sel_f.before($('<span>', {'class': 'done'}));
    sel_l.after ($('<span>', {'class': 'done'}));

    const selections = sel_f;
    const all = $('#selection a');

    selections.each((i, q) => {
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

                if (!selection.next().length) {              // done sentence
                    parent.attr('href', parent.text());     // click able
                    all.removeClass('movable');        // remove other
                    parent.addClass('movable');           // add self
                }
            }

            if (isignore(e)) {
                return false;
            }
        });
    });

    let holder_id = setTimeout(() => $('.holder').addClass('visible'), 5000);
    $(document).keydown(() => {
        $('.holder.visible').removeClass('visible');
        clearInterval(holder_id);
        holder_id = setTimeout(() => $('.holder').addClass('visible'), 5000);
    });
    $(document).keypress(e => {
        const link = $('#selection a.movable');
        if (isnl(e) && link.length) {
            location.href = link.text();
        }
    });
});

