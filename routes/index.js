const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const socket = require('../module/socket.js');
const router = new express.Router();

const url = require('url');

const config = require('config');

const Pool = require('pg').Pool;
const params = url.parse(process.env.DATABASE_URL || config.get('DATABASE_URL'));
const auth = params.auth.split(':');
const ssl = config.has('ssl') ? config.get('ssl') : true;
const pool = new Pool({
    'user': auth[0],
    'password': auth[1],
    'host': params.hostname,
    'port': params.port,
    'database': params.pathname.split('/')[1],
    'ssl': ssl,
    'max': 20,
    'idleTimeoutMillis': 1000,
});

const rankMAX = 10;
const keyboards = ['JIS', 'US'];
const layouts = ['QWERTY', 'Dvorak', 'Colemak'];

const mans = new Array();

fs.readdir('./views/mans', (err, files) => {
    files.forEach((file) => {
        mans.push(path.basename(file, '.pug'));
    });
});

router.use((req, res, next) => {
    res.locals.keyboards = keyboards;
    if (req.cookies.keyboard) {
        res.locals.keyboard = req.cookies.keyboard;
    } else {
        res.locals.keyboard = keyboards[0];
    }

    res.locals.layouts = layouts;
    if (req.cookies.layout) {
        res.locals.layout = req.cookies.layout;
    } else {
        res.locals.layout = layouts[0];
    }

    next();
});


/* GET home page. */
router.get('/', (req, res, next) => {
    const q = 'SELECT man, name, time FROM record AS a WHERE NOT EXISTS(SELECT 1 FROM record as b WHERE a.man = b.man AND(a.time > b.time OR a.time = b.time AND a.error > b.error))';
    pool.query(q, (err, ret) => {
        if (err) {
            console.error(err);
            res.end('error');
            return;
        }
        const holder = {};
        ret.rows.forEach(row => {
            holder[row.man] = {
                'name': row.name,
                'time': moment(row.time).format('mm:ss'),
            };
        });
        res.render('index', {
            'mans': mans,
            'holder': holder,
        });
    });
});

router.get('/:man', (req, res, next) => {
    const trg = req.params.man;
    if (mans.indexOf(trg) < 0) {
        next();
        return;
    }

    const ranks = new Array(rankMAX);

    const q = 'SELECT * FROM record WHERE man = $1::text ORDER BY time, error, date DESC LIMIT $2::int;';
    pool.query(q, [trg, rankMAX], (err, ret) => {
        if (err) {
            console.error(err);
            res.end('error');
            return;
        }

        ret.rows.forEach((row, i) => {
            ranks[i] = {
                'name': row.name,
                'time': row.time,
                'timer': moment(row.time).format('mm:ss.SS'),
                'error': row.error,
            };
        });
        for (let i = ret.rows.length; i < ranks.length; ++i) {
            ranks[i] = {
                'name': 'NoData',
                'time': 30 * 60 * 1000,
                'timer': moment(30 * 60 * 1000).format('mm:ss.SS'),
                'error': 0,
            };
        }

        res.render('mans/' + trg, {'ranks': ranks});
    });
});

router.post('/:man', (req, res, next) => {
    const trg = req.params.man;
    if (mans.indexOf(trg) < 0) {
        next();
        return;
    }

    console.log(req.body);
    let valid = true;
    if (!req.body.name || !req.body.time || !req.body.error
        || req.body.name.length > 12 || req.body.time < 0 || req.body.error < 0) {
        valid = false;
    }

    if (valid) {
        const q = 'INSERT INTO record VALUES($1, $2, $3, $4, $5)';
        pool.query(q, [moment().unix(), trg, req.body.name, req.body.time, req.body.error], (err, ret) => {
            if (err) {
                console.error(err);
                valid = false;
            }
        });
    }

    if (valid) {
        res.end('ok');
        socket.post(trg, req.body);
    } else {
        res.status(400);
        res.end('invalid');
    }
});

module.exports = router;
