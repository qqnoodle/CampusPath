require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { sendOTPEmail } = require('../brevo/sendOTPEmail.js');

const Users = require("../models/users.model.js");
const SALT = 12; //FOR bcrypt seed

const generateOTP = (expireIn) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + expireIn * 60 * 1000)
    return {
        otp: otp,
        otpExpiry: otpExpiry
    };
}

const createJwtToken = (id, username) => {
    return jwt.sign(
        {
            id: id,
            username: username
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
}

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username) return res.status(401).send("Empty Username");
        if (!password) return res.status(401).send("Empty Password");

        const existingUser = await Users.findOne({ username: username });
        if (!existingUser) return res.status(401).send("Username does not exist");

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) return res.status(401).send("Invalid Password");

        if (!existingUser.isVerified) return res.status(401).send("Account not activated");
        //Return JWT Token
        const jwtToken = createJwtToken(existingUser._id, existingUser.username);
        return res.status(200).json({ jwtToken });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
};

const verifyToken = async (req, res) => {
    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        return res.status(200).json(
            {
                success: true,
                message: "Authenticated"
            }
        );
    } catch (error) {
        let statusCode = 500;
        let message = "Unknown Error";
        switch (error.name) {
            case "TokenExpiredError":
                statusCode = 401;
                message = "Token Expired";
                break;

            case "JsonWebTokenError":
                statusCode = 401;
                message = "Invalid token";
                break;

            case "NotBeforeError":
                statusCode = 401;
                message = "Token not active yet"
                break

            default:
                statusCode = 500;
                message = error.message;
                break;
        }
        return res.status(statusCode).json(
            {
                success: false,
                message: message
            }
        );
    }
}


const passwordStrength = (password) => {
    let warnings = "";
    let strong = true;
    if (password.length < 6) {
        strong = false;
        warnings = warnings + "Minimum 6 characters\n";
    }
    if (!/[A-Z]/.test(password)) {
        strong = false;
        warnings = warnings + "At least 1 Uppercase\n";
    }
    if (!/[a-z]/.test(password)) {
        strong = false;
        warnings = warnings + "At least 1 Lowercase\n";
    }
    if (!/[0-9]/.test(password)) {
        strong = false;
        warnings = warnings + "At least 1 numeric\n";
    }
    if (!/[!@#$%^&*]/.test(password)) {
        strong = false;
        warnings = warnings + "At least 1 special character\n";
    }
    return { isStrong: strong, warnings: warnings };
};


const handleSignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username) return res.status(401).send("Empty Username");
        if (!email) return res.status(401).send("Empty Email");
        if (!password) return res.status(401).send("Empty Password");

        const userNameTaken = !!await Users.findOne({ username: username });
        if (userNameTaken) return res.status(409).send("Username has been taken");

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validEmail) return res.status(400).send("Improper email format");

        const { isStrong, warnings } = passwordStrength(password);
        if (!isStrong) return res.status(400).send(warnings);

        const encryptedPassword = await bcrypt.hash(password, SALT);

        const { otp, otpExpiry } = generateOTP(5);

        await Users.create({
            username: username,
            email: email,
            password: encryptedPassword,
            otp: otp,
            otpExpiry: otpExpiry
        });

        res.status(201).send("Your account has been created");

    } catch (error) {
        console.log(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
};


const refreshOTP = async (req, res) => {
    try {
        const { username } = req.body;

        //validate prescence
        const existingUser = await Users.findOne({ username: username });
        if (!existingUser) return res.status(400).send("Username does not exist");

        //make new otp
        const { otp, otpExpiry } = generateOTP(5);
        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        await existingUser.save();

        //send email
        const response = await sendOTPEmail(existingUser.email, otp)
        if (response.success) return res.status(201).send("OTP refreshed");
        return res.status(500).send(response.message);

    } catch (error) {
        console.log(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { username, otp, purpose } = req.body;
        if (!otp) return res.status(400).send("Invalid OTP");

        const existingUser = await Users.findOne({
            username: username,
        });

        if (!existingUser) return res.status(401).send("User does not exist");
        if (existingUser.otp !== otp) return res.status(400).send("Invalid OTP");
        if (existingUser.otpExpiry < Date.now()) return res.status(400).send("OTP expired");

        const jwtToken = createJwtToken(existingUser._id, existingUser.username);

        switch (purpose) {
            case 'ACCOUNT-ACTIVATION':
                existingUser.isVerified = true;
                await existingUser.save();
                break;
            case 'PASSWORD-RESET':
                break;
        }
        return res.status(200).json({ success: true, message: "OTP verified", jwtToken: jwtToken })

    } catch (error) {
        console.log(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}

module.exports = {
    handleLogin,
    verifyToken,
    handleSignUp,
    refreshOTP,
    verifyOTP
};
