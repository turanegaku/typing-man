const express = require('express');
const fs = require('fs');
const path = require('path');
const router = new express.Router();

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
    console.log(req.params.man in mans);
    if (mans.indexOf(req.params.man) >= 0) {
        res.render('mans/' + req.params.man, {'title': 'typing-man'});
    } else {
        next();
    }
});

module.exports = router;
