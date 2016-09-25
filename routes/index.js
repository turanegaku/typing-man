const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const router = new express.Router();

const mans = new Array();
let db;

fs.readdir('./views/mans', (err, files) => {
    files.forEach((file) => {
        mans.push(path.basename(file, '.pug'));
    });
});

db = new sqlite3.Database('./database.sqlite3');
db.serialize(() => {
    db.run('CREATE TABLE record (date INTEGER, man TEXT, name TEXT, time INTEGER)',
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
    const ranks = new Array();
    db = new sqlite3.Database('./database.sqlite3');
    // db.each('SELECT * FROM record WHERE man == ?', trg, (err, row) => {
    //     console.log(row);
    //     ranks.push({'name': row.name, 'time': moment(row.time).format('mm:ss.SS')});
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    db.all('SELECT * FROM record WHERE man == ? ORDER BY time, date DESC LIMIT 10', trg, (err, rows) => {
        if (err) {
            console.error(err);
            res.end('error');
            return;
        }
        rows.forEach(row => {
            ranks.push({'name': row.name, 'time': moment(row.time).format('mm:ss.SS')});
        });

        while (ranks.length < 10) {
            ranks.push({'name': 'NoData', 'time': moment(30 * 60 * 1000).format('mm:ss.SS')});
        }

        res.render('mans/' + trg, {
            'title': 'typing-man',
            'ranks': ranks,
            'name': req.cookies.name
        });
    });
    db.close();
});

router.post('/:man', (req, res, next) => {
    const trg = req.params.man;
    if (mans.indexOf(trg) < 0) {
        res.end('invarid');
        return;
    }

    const name = req.body.name;
    const time = moment(req.body.time, 'mm:ss.SS') - moment('0', 'm');
    console.log(trg, name, time);
    let valid = true;
    if (name.length > 12 || time < 0) {
        valid = false;
    }

    if (valid) {
        db = new sqlite3.Database('./database.sqlite3');
        db.run('INSERT INTO record VALUES(?, ?, ?, ?)', moment().unix(), trg, name, time, (err) => {
            if (err) {
                console.error(err);
                valid = false;
            }
        });
        db.close();
    }

    if (valid) {
        res.cookie('name', name);
        res.end('ok');
    } else {
        res.end('invalid');
        return;
    }
});

module.exports = router;
