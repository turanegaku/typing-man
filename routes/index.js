const express = require('express');
const path = require('path');
const router = new express.Router();

const mans = [];

fs.readdir('./views/mans', (err, files) => {
    files.forEach((file) => {
        mans.push(path.basename(file, '.pug'));
    });
});

/* GET home page. */
router.get('/:man', (req, res, next) => {
    res.render('mans/' + req.params.man, {'title': 'Express'});
});

module.exports = router;
