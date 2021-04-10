const { loginValidation, registervalidation,resetPasswordValidation } = require('../../middleware/validation/books/authValidation')
const { passwordPolicy } = require('../../middleware/policy/books/passwordPolicy')
const User = require('../../model/user.model');
const Account = require('../../model/account.model');
var {welcomeEmail} = require('../../middleware/mail/welcome-email')
var {resetPassword} = require('../../middleware/mail/reset-password')
var {resetSuccess} = require('../../middleware/mail/reset-email-success')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('../../../passport')
const envConfig = require('config')

//  Generate Auth Token
let genToken = user => {
    return jwt.sign({
        iss: 'Joan_Louji',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, envConfig.JWT_SECRET.authToken);
}

//  Generate Password Reset Tokens
let genPasswordResetToken = user => {
    return jwt.sign({
        iss: 'Joan_Louji',
        sub: user.id,
        iat: new Date().getTime(),
        exp: Math.floor(Date.now() / 1000) + (60*2)
    }, envConfig.JWT_SECRET.resetToken);
}

module.exports = {
    // Create Accounts
    createAccount : async function(req, res){

    },     
}