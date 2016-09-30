const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const socket = require('../module/socket.js');
const router = new express.Router();

const url = require('url');

const Pool = require('pg').Pool;
const params = url.parse(process.env.DATABASE_URL || require('config').get('DATABASE_URL'));
const auth = params.auth.split(':');
const pool = new Pool({
    'user': auth[0],
    'password': auth[1],
    'host': params.hostname,
    'port': params.port,
    'database': params.pathname.split('/')[1],
    'ssl': true,
    'max': 20,
    'idleTimeoutMillis': 1000,
});

const rankMAX = 10;

const mans = new Array();

fs.readdir('./views/mans', (err, files) => {
    files.forEach((file) => {
        mans.push(path.basename(file, '.pug'));
    });
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {'title': 'typing-man', 'mans': mans});
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

        const arg = {
            'title': 'typing-man',
            'ranks': ranks,
        };
        if (req.cookies.name) {
            arg.name = req.cookies.name;
        }

        res.render('mans/' + trg, arg);
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
        res.cookie('name', req.body.name);
        res.end('ok');
        socket.post(trg, req.body);
    } else {
        res.status(400);
        res.end('invalid');
    }
});

module.exports = router;
