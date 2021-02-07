const express = require('express');
const router = express();
const auth = require('./auth.route')

router.use('/auth',auth)

module.exports = router;