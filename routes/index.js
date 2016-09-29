const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const socket = require('../module/socket.js');
const router = new express.Router();

const rankMAX = 10;

const mans = new Array();
let db;

fs.readdir('./views/mans', (err, files) => {
    files.forEach((file) => {
        mans.push(path.basename(file, '.pug'));
    });
});

db = new sqlite3.Database('./database.sqlite3');
db.serialize(() => {
    db.run('CREATE TABLE record (date INTEGER, man TEXT, name TEXT, time INTEGER, error INTEGER)',
           () => {}); // table exist error cushion
});
db.close();

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
    db = new sqlite3.Database('./database.sqlite3');
    db.all('SELECT * FROM record WHERE man == ? ORDER BY time, error, date DESC LIMIT 10', trg, (err, rows) => {
        if (err) {
            console.error(err);
            res.end('error');
            return;
        }

        rows.forEach((row, i) => {
            ranks[i] = {
                'name': row.name,
                'time': row.time,
                'timer': moment(row.time).format('mm:ss.SS'),
                'error': row.error,
            };
        });
        for (let i = rows.length; i < ranks.length; ++i) {
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
    db.close();
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
        db = new sqlite3.Database('./database.sqlite3');
        db.run('INSERT INTO record VALUES(?, ?, ?, ?, ?)', moment().unix(), trg, req.body.name, req.body.time, req.body.error, (err) => {
            if (err) {
                console.error(err);
                valid = false;
            }
        });
        db.close();
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
