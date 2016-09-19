const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/:man', (req, res, next) => {
    res.render(req.params.man, {'title': 'Express'});
});

module.exports = router;
