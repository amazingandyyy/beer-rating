var express = require('express');
var router = express.Router();

router.use('/users', require('./users'));
router.use('/beer', require('./beer'));

module.exports = router;
