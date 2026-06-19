
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
        }
    }
);


const Users = mongoose.model('User', UserSchema);
module.exports = Users;

