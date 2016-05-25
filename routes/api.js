var express = require('express');
var router = express.Router();

router.use('/users', require('./users'));
router.use('/post', require('./post'));

module.exports = router;
