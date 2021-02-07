const express = require('express');
const router = express.Router();
const passportAuth  = require('../../controller/books/auth.controller')
const passport = require('passport')
const { auth }  = require('quick-middleware')

router.post('/login', passportAuth.passportLogin);
router.post('/register', passportAuth.passportRegister);
router.get('/secret', passport.authenticate('jwt',{ session: false }), auth.isActive, passportAuth.passportUser)
router.put('/update', passport.authenticate('jwt',{ session: false }), auth.isActive, passportAuth.passportUserUpdate)
router.get('/logout', passport.authenticate('jwt',{ session: false }), auth.isActive, passportAuth.passportLogout)
router.post('/reset', passportAuth.passportPasswordReset)
router.put('/reset', passportAuth.passportResetPassword)
router.put('/deactivate',passport.authenticate('jwt',{ session: false }), auth.isActive, passportAuth.passportDeactivate)
router.put('/passwordChange', passport.authenticate('jwt',{ session: false }), auth.isActive, passportAuth.passportChangePassword)

module.exports = router;