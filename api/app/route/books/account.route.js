const express = require('express');
const router = express.Router();
const passportAccount  = require('../../controller/books/account.controller')
const passport = require('passport')
const { auth }  = require('quick-middleware')

router.post('/create', passport.authenticate('jwt',{ session: false }), auth.isActive, passportAccount.createAccount)

module.exports = router;