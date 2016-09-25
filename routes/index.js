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
    db.run('CREATE TABLE result (id TEXT, man TEXT, time INTEGER)',
           () => {}); // table exist error cushion
});
db.close();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {'title': 'typing-man', 'mans': mans});
});

router.get('/:man', (req, res, next) => {
    const trg = req.params.man;
    const ranks = new Array();
    db = new sqlite3.Database('./database.sqlite3');
    db.each('SELECT * FROM result', (err, row) => {
        ranks.push({});
        console.log(err);
    });
    db.close();

    while (ranks.length < 10) {
        ranks.push({'name': 'NoData', 'time': moment(30 * 60 * 1000).format('mm:ss.SS')});
    }

    if (mans.indexOf(trg) >= 0) {
        res.render('mans/' + trg, {'title': 'typing-man', 'ranks': ranks});
    } else {
        next();
    }
});

module.exports = router;
