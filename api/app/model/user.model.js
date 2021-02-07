var mongoose = require('mongoose')

var activitySchema = new mongoose.Schema({
    last_login:{
        type: Date,
        default: Date.now(),
    },
    ip: {
        type: String,
        default: ''
    },
    agent: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

var notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Auth', 'Account', 'Transcation', 'Profile'],
        default: ''
    },
    message: {
        type: String,
        default: '',
    },
    created:{
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

var userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isMember: {
        type: Boolean,
        required: true,
        default: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    password_reset_token: {
        type: String,
        required: false,
        default: ''
    },
    bio: {
        type: String,
        required: false,
        default: ''
    },
    profile_img: {
        type: String,
        required: false,
        default: 'https://firebasestorage.googleapis.com/v0/b/nextbooks-1a9f0.appspot.com/o/Profile%2Funnamed.jpg?alt=media&token=26aa8e12-b869-4a2f-afde-ced8ebe2bf0e'
    },
    logs: [activitySchema],
    notifications: [notificationSchema]
},{timestamps: true})

module.exports = mongoose.model('User', userSchema);