const { loginValidation, registervalidation,resetPasswordValidation } = require('../../middleware/validation/books/authValidation')
const { passwordPolicy } = require('../../middleware/policy/books/passwordPolicy')
const User = require('../../model/user.model');
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

    // Passport Login
    passportLogin : async function(req, res){
        const { email, password } = req.body;
        // Validating Payload with JOI
        const {error} =  loginValidation(req.body);
        if(error) return res.status(400).json({"error":error.details[0].message});

        //  Check if user exists
        const userExists = await User.findOne({ email: email }).populate("activity");
        if(!userExists) return res.status(404).json({"error":"User does not exist"})
        if(!userExists.isActive) return res.status(401).json({'error':'Account Deactivated. Contact Admin'})

        //  Validate User
        const validpass = await bcrypt.compare(password,userExists.password)
        if(!validpass) return res.status(404).json({'error':'Invalid Password'})

        // Provide JWT Token
        const token = genToken(userExists)

        // Login Activity
        const doc = {
            last_login: Date.now(),
            ip: JSON.stringify(req.ip),
            agent: req.headers["user-agent"],
        }

        //  Store User Logs
        User.findOneAndUpdate({_id: userExists._id},{$addToSet:{logs: doc}}, { safe: true, upsert: true },function(err,done){
            if (err) return res.status(500).json({ "error": err })          
        }).exec().then((data)=>{
            return res.status(200).json({'user':data,'Token':token})  
        })

    },

    // Passport Register
    passportRegister : async function(req, res){
        const { email, password, first_name, last_name, mobile, bio, profile_img } = req.body;
        // Validating Payload with JOI
        const {error} = registervalidation(req.body);
        if(error) return res.status(400).json({"error":error.details[0].message});
        
        // Check if user exists
        const userExists = await User.findOne({ email: email });
        if(userExists) return res.status(400).json({"error":"User exist"})

        //  Password Policy
        const validPassword = passwordPolicy(req.body);
        if(validPassword) return res.status(400).json({"error": validPassword.error})

        // HashPassword
        const salt = await bcrypt.genSalt(10)
        const saltPassword = await bcrypt.hash(password,salt)

        // Activity
        const doc = {
            last_login: Date.now(),
            ip: JSON.stringify(req.ip),
            agent: req.headers["user-agent"],
        }

        //  Notifications
        const noti = {
            type: 'Auth',
            message: 'Welcome.  Account Created Successfully',
        }

        // Register User
        try{
            var user = User({
                email: email,
                password: saltPassword,
                first_name: first_name,
                last_name: last_name,
                mobile: mobile,
                bio: bio,
                profile_img: profile_img,
                logs: doc,
            })
            
            //  Save user to database
            user.save((err,done)=>{
                if (err) return res.status(500).json({ "error": err })
                console.log(done)
                User.findOneAndUpdate({_id: done._id}, {$addToSet: {notifications:noti}},{ safe: true, upsert: true }, (errors, ok)=>{
                    if(err) return res.status(500).json({'error':errors})
                    // Provide JWT Token
                    const token = genToken(user)
                    // Send Email Welcome Email
                    welcomeEmail(user)
                    return res.status(200).json({'user':done, 'Token':token})
                })
            })          
        }catch(err){
            return res.status(400).json({ "error": err })
        }
    },

    // Return the user details
    passportUser : async function(req,res){
        return res.status(200).json({'user':req.user})
    },

    // Update User
    passportUserUpdate: async function(req,res){
        var { first_name, last_name, mobile, bio, profile_img } = req.body;
        // Check if user exists
        const userExists = await User.findOne({ _id: req.user._id });
        if(!userExists) return res.status(500).json({"error":"No Record Found"})
        
        //  Data validation
        if(first_name ==='' || !first_name) {first_name = userExists.first_name}
        if(last_name ==='' || !last_name) {last_name = userExists.last_name}
        if(mobile ==='' || !mobile) {mobile = userExists.mobile}
        if(bio ==='' || !bio) {bio = userExists.bio}
        if(profile_img ==='' || !profile_img) {profile_img = userExists.profile_img}

        //  Updates firlds into database
        try{
            User.findOneAndUpdate({_id: req.user._id},{$set: {first_name: first_name, last_name: last_name, mobile: mobile, bio: bio, profile_img: profile_img}},{new: true},function(err,done){
                if (err) return res.status(500).json({ "error": err })
                User.findOneAndUpdate({_id: req.user._id}, {$addToSet: {notifications:{type: 'Profile', message: `Profile updated.`}}},{ safe: true, upsert: true }, (error, ok)=>{
                    if(err) return res.status(500).json({'error':error})
                    return res.status(200).json({'msg':'Successfull','user':done})
                })
            })
        }catch(err){
            return res.status(500).json({ "error": err })
        }
    },

    // Logout
    passportLogout: async function(req,res){
        res.status(200).json({'msg':'Logged out successfully'})
    },

    // Reset Password Token - For non-authenticated Users
    passportPasswordReset: async function(req,res){
        const { email } = req.body

        // Validating Payload with JOI
        const { error } = resetPasswordValidation(req.body)
        if(error) return res.status(404).json({"error":error.details[0].message});

        // Check if user exists
        const userExists = await User.findOne({ email: email });
        if(!userExists) return res.status(500).json({"error":"User does not exist"})
        
        //  Resets password and send the logical link to the user via Mail
        try{
            const token = genPasswordResetToken(userExists)
            User.findOneAndUpdate({_id: userExists._id},{$set: {password_reset_token: token}},(err,doc)=>{
                if (err) return res.status(500).json({ "error": err })
                var reset_url = `${envConfig.CLIENT_URL}/auth/password/${token}`
                resetPassword(userExists,reset_url)
                res.status(200).json({'msg':"Instruction to change password has been sent to your registered Email Address.",})
            })
        }catch(err){
            return res.status(500).json({ "error": err })
        }

    },
 
    // Reset Password  - For non Authenticated Users
    passportResetPassword: async function(req,res){
        const { resetLink, newpassword } = req.body

        // HashPassword
        const salt = await bcrypt.genSalt(10)
        const saltPassword = await bcrypt.hash(newpassword,salt)

        const doc = {
            password: saltPassword,
        }
        
        if(resetLink){
            //  Verify JWT token
            jwt.verify(resetLink, envConfig.JWT_SECRET.resetToken, function(err,data){
                if(err) return res.status(401).json({'error':'Invalid Token. Token is valid only for 2 mins.  You URL might have expired.  Try to get a new URL again.'})
                //  Identifies, to whom the JWT token belongs
                User.findOne({password_reset_token:resetLink},(errors,user)=>{
                    if(errors || !user) return res.status(500).json({"error":"User does not exist"})
                    //  Updates Password
                    User.update({_id: user._id},doc,{ safe: true, upsert: true },function(er,us){
                        if(er) return res.status(500).json({"error":"Reset Password Error"})
                        User.findOneAndUpdate({_id: user._id}, {$addToSet: {notifications:{type: 'Auth', message: 'Password Changed Via Mail.'}}},{ safe: true, upsert: true }, (error, ok)=>{
                            if(err) return res.status(500).json({'error':error})
                            resetSuccess(user.first_name, user.email)
                            return res.status(200).json({"msg":"Password Changed"})                        
                        })
                    })
                })
            })
        }else{
            return res.status(500).json({'error':'Authentication Error!!'})
        }
    },

    //  Deactivate Account
    passportDeactivate: async function (req,res){
        User.findOneAndUpdate({_id: req.user.id},{$set:{isActive: false}},(err,data)=>{
            if (err) return res.status(400).json({ "error": err })
            User.findOneAndUpdate({_id: req.user._id}, {$addToSet: {notifications:{type: 'Auth', message: 'Account Deactivated.'}}},{ safe: true, upsert: true }, (error, ok)=>{
                if(err) return res.status(500).json({'error':error})
                return res.status(200).json({'msg':"Successfull",user: data})
            })
        })
    },

    //  Change Password  - For Authenticated Users
    passportChangePassword: async function(req,res){
        const { password } = req.body

        //  Data Validation
        if(password === '' || !password) return res.status(404).json({'error':'Password Field is mandatory'})

        //  Password Policy
        const validPassword = passwordPolicy({password: password, first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email});
        if(validPassword) return res.status(400).json({"error": validPassword.error})
        
        // HashPassword
        const salt = await bcrypt.genSalt(10)
        const saltPassword = await bcrypt.hash(password,salt)
        
        //  Changes password
        User.findOneAndUpdate({_id: req.user._id},{$set:{password: saltPassword}},(err,done)=>{
            if(err) return res.status(500).json({'error':err})
            User.findOneAndUpdate({_id: req.user._id}, {$addToSet: {notifications:{type: 'Auth', message: 'Password Changed via App'}}},{ safe: true, upsert: true }, (error, ok)=>{
                if(err) return res.status(500).json({'error':error})
                return res.status(200).json({'msg':'Successfull', user: done})
            })
        })
    }       
}