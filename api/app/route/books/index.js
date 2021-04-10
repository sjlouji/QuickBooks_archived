const express = require('express');
const router = express();
const auth = require('./auth.route')
const account = require('./account.route')

router.use('/auth',auth)
router.use('/account',account)

module.exports = router;