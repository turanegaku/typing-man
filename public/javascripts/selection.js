/* global $ location document */

$(() => {
    // =============== constant =============== //
    const layout_q2d = {
        /*    */ 32: 32,   /* !! */ 33: 33,   /* "_ */ 34: 95,   /* ## */ 35: 35,
        /* $$ */ 36: 36,   /* %% */ 37: 37,   /* && */ 38: 38,   /* '- */ 39: 45,
        /* (( */ 40: 40,   /* )) */ 41: 41,   /* ** */ 42: 42,   /* +} */ 43: 125,
        /* ,w */ 44: 119,  /* -[ */ 45: 91,   /* .v */ 46: 118,  /* /z */ 47: 122,
        /* 00 */ 48: 48,   /* 11 */ 49: 49,   /* 22 */ 50: 50,   /* 33 */ 51: 51,
        /* 44 */ 52: 52,   /* 55 */ 53: 53,   /* 66 */ 54: 54,   /* 77 */ 55: 55,
        /* 88 */ 56: 56,   /* 99 */ 57: 57,   /* :S */ 58: 83,   /* ;s */ 59: 115,
        /* <W */ 60: 87,   /* =] */ 61: 93,   /* >V */ 62: 86,   /* ?Z */ 63: 90,
        /* @@ */ 64: 64,   /* AA */ 65: 65,   /* BX */ 66: 88,   /* CJ */ 67: 74,
        /* DE */ 68: 69,   /* E> */ 69: 62,   /* FU */ 70: 85,   /* GI */ 71: 73,
        /* HD */ 72: 68,   /* IC */ 73: 67,   /* JH */ 74: 72,   /* KT */ 75: 84,
        /* LN */ 76: 78,   /* MM */ 77: 77,   /* NB */ 78: 66,   /* OR */ 79: 82,
        /* PL */ 80: 76,   /* Q" */ 81: 34,   /* RP */ 82: 80,   /* SO */ 83: 79,
        /* TY */ 84: 89,   /* UG */ 85: 71,   /* VK */ 86: 75,   /* W< */ 87: 60,
        /* XQ */ 88: 81,   /* YF */ 89: 70,   /* Z: */ 90: 58,   /* [/ */ 91: 47,
        /* \\ */ 92: 92,   /* ]= */ 93: 61,   /* ^^ */ 94: 94,   /* _{ */ 95: 123,
        /* `` */ 96: 96,   /* aa */ 97: 97,   /* bx */ 98: 120,  /* cj */ 99: 106,
        /* de */ 100: 101, /* e. */ 101: 46,  /* fu */ 102: 117, /* gi */ 103: 105,
        /* hd */ 104: 100, /* ic */ 105: 99,  /* jh */ 106: 104, /* kt */ 107: 116,
        /* ln */ 108: 110, /* mm */ 109: 109, /* nb */ 110: 98,  /* or */ 111: 114,
        /* pl */ 112: 108, /* q' */ 113: 39,  /* rp */ 114: 112, /* so */ 115: 111,
        /* ty */ 116: 121, /* ug */ 117: 103, /* vk */ 118: 107, /* w, */ 119: 44,
        /* xq */ 120: 113, /* yf */ 121: 102, /* z; */ 122: 59,  /* {? */ 123: 63,
        /* || */ 124: 124, /* }+ */ 125: 43,  /* ~~ */ 126: 126,
    };
    const layout_q2c = {
        /*    */ 32: 32,   /* !! */ 33: 33,   /* "" */ 34: 34,   /* ## */ 35: 35,
        /* $$ */ 36: 36,   /* %% */ 37: 37,   /* && */ 38: 38,   /* '' */ 39: 39,
        /* (( */ 40: 40,   /* )) */ 41: 41,   /* ** */ 42: 42,   /* ++ */ 43: 43,
        /* ,, */ 44: 44,   /* -- */ 45: 45,   /* .. */ 46: 46,   /* // */ 47: 47,
        /* 00 */ 48: 48,   /* 11 */ 49: 49,   /* 22 */ 50: 50,   /* 33 */ 51: 51,
        /* 44 */ 52: 52,   /* 55 */ 53: 53,   /* 66 */ 54: 54,   /* 77 */ 55: 55,
        /* 88 */ 56: 56,   /* 99 */ 57: 57,   /* :O */ 58: 79,   /* ;o */ 59: 111,
        /* << */ 60: 60,   /* == */ 61: 61,   /* >> */ 62: 62,   /* ?? */ 63: 63,
        /* @@ */ 64: 64,   /* AA */ 65: 65,   /* BB */ 66: 66,   /* CC */ 67: 67,
        /* DS */ 68: 83,   /* EF */ 69: 70,   /* FT */ 70: 84,   /* GD */ 71: 68,
        /* HH */ 72: 72,   /* IU */ 73: 85,   /* JN */ 74: 78,   /* KE */ 75: 69,
        /* LI */ 76: 73,   /* MM */ 77: 77,   /* NK */ 78: 75,   /* OY */ 79: 89,
        /* P: */ 80: 58,   /* QQ */ 81: 81,   /* RP */ 82: 80,   /* SR */ 83: 82,
        /* TG */ 84: 71,   /* UL */ 85: 76,   /* VV */ 86: 86,   /* WW */ 87: 87,
        /* XX */ 88: 88,   /* YJ */ 89: 74,   /* ZZ */ 90: 90,   /* [[ */ 91: 91,
        /* \\ */ 92: 92,   /* ]] */ 93: 93,   /* ^^ */ 94: 94,   /* __ */ 95: 95,
        /* `` */ 96: 96,   /* aa */ 97: 97,   /* bb */ 98: 98,   /* cc */ 99: 99,
        /* ds */ 100: 115, /* ef */ 101: 102, /* ft */ 102: 116, /* gd */ 103: 100,
        /* hh */ 104: 104, /* iu */ 105: 117, /* jn */ 106: 110, /* ke */ 107: 101,
        /* li */ 108: 105, /* mm */ 109: 109, /* nk */ 110: 107, /* oy */ 111: 121,
        /* p; */ 112: 59,  /* qq */ 113: 113, /* rp */ 114: 112, /* sr */ 115: 114,
        /* tg */ 116: 103, /* ul */ 117: 108, /* vv */ 118: 118, /* ww */ 119: 119,
        /* xx */ 120: 120, /* yj */ 121: 106, /* zz */ 122: 122, /* {{ */ 123: 123,
        /* || */ 124: 124, /* }} */ 125: 125, /* ~~ */ 126: 126,
    };
    const layout_j2u = {
        /*    */ 32: 32,   /* !! */ 33: 33,   /* "@ */ 34: 64,   /* ## */ 35: 35,
        /* $$ */ 36: 36,   /* %% */ 37: 37,   /* &^ */ 38: 94,   /* '& */ 39: 38,
        /* (* */ 40: 42,   /* )( */ 41: 40,   /* *" */ 42: 34,   /* +: */ 43: 59,
        /* ,, */ 44: 44,   /* -- */ 45: 45,   /* .. */ 46: 46,   /* // */ 47: 47,
        /* 00 */ 48: 48,   /* 11 */ 49: 49,   /* 22 */ 50: 50,   /* 33 */ 51: 51,
        /* 44 */ 52: 52,   /* 55 */ 53: 53,   /* 66 */ 54: 54,   /* 77 */ 55: 55,
        /* 88 */ 56: 56,   /* 99 */ 57: 57,   /* :' */ 58: 39,   /* ;; */ 59: 59,
        /* << */ 60: 60,   /* =_ */ 61: 95,   /* >> */ 62: 62,   /* ?? */ 63: 63,
        /* @/ */ 64: 47,   /* AA */ 65: 65,   /* BB */ 66: 66,   /* CC */ 67: 67,
        /* DD */ 68: 68,   /* EE */ 69: 69,   /* FF */ 70: 70,   /* GG */ 71: 71,
        /* HH */ 72: 72,   /* II */ 73: 73,   /* JJ */ 74: 74,   /* KK */ 75: 75,
        /* LL */ 76: 76,   /* MM */ 77: 77,   /* NN */ 78: 78,   /* OO */ 79: 79,
        /* PP */ 80: 80,   /* QQ */ 81: 81,   /* RR */ 82: 82,   /* SS */ 83: 83,
        /* TT */ 84: 84,   /* UU */ 85: 85,   /* VV */ 86: 86,   /* WW */ 87: 87,
        /* XX */ 88: 88,   /* YY */ 89: 89,   /* ZZ */ 90: 90,   /* [] */ 91: 93,
        /* \\ */ 92: 92,   /* ]` */ 93: 96,   /* ^= */ 94: 61,   /* __ */ 95: 95,
        /* `{ */ 96: 123,  /* aa */ 97: 97,   /* bb */ 98: 98,   /* cc */ 99: 99,
        /* dd */ 100: 100, /* ee */ 101: 101, /* ff */ 102: 102, /* gg */ 103: 103,
        /* hh */ 104: 104, /* ii */ 105: 105, /* jj */ 106: 106, /* kk */ 107: 107,
        /* ll */ 108: 108, /* mm */ 109: 109, /* nn */ 110: 110, /* oo */ 111: 111,
        /* pp */ 112: 112, /* qq */ 113: 113, /* rr */ 114: 114, /* ss */ 115: 115,
        /* tt */ 116: 116, /* uu */ 117: 117, /* vv */ 118: 118, /* ww */ 119: 119,
        /* xx */ 120: 120, /* yy */ 121: 121, /* zz */ 122: 122, /* {} */ 123: 125,
        /* || */ 124: 124, /* }~ */ 125: 126, /* ~+ */ 126: 43,
    };


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

    $(document).keydown(e => {
        const keyboard = $('header form#layout [name=keyboard]:checked').val();
        const layout = $('header form#layout [name=layout]:checked').val();
        if (keyboard === 'JIS' && layout !== 'QWERTY' && e.which === 48 && e.shiftKey) {
            $(document).trigger($.Event('keypress', {'which': 41}));
        }
    });
    $(document).keypress(e => {
        const keyboard = $('header form#layout [name=keyboard]:checked').val();
        const layout = $('header form#layout [name=layout]:checked').val();
        if (layout === 'QWERTY') {
            return;
        }
        switch (layout) {
        case 'Dvorak':
            if (keyboard === 'JIS') {
                e.which = layout_j2u[e.which];
            }
            e.which = layout_q2d[e.which];
            break;
        case 'Colemak':
            if (keyboard === 'JIS') {
                e.which = layout_j2u[e.which];
            }
            e.which = layout_q2c[e.which];
            break;
        default:
        }
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
    $(document).keydown(e => {
        const link = $('#selection a.movable');
        if (isnl(e)) {
            if (link.length) {
                location.href = link.text();
            }
            return false;
        }
    });
});

