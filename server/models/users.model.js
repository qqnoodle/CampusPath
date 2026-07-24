
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true],
            trim: true
        },
        isVerified: {
            type: Boolean,
            required: [true],
            default: false
        },
        otp: {
            type: Number,
            min: 100000,
            max: 999999
        },
        otpExpiry: {
            type: Date,
        }
    }
);


const Users = mongoose.model('User', UserSchema);
module.exports = Users;

