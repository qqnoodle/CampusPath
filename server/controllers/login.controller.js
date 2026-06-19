require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Users = require("../models/users.model.js");

const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username) return res.status(401).send("Empty Username");
        if (!password) return res.status(401).send("Empty Password");

        const existingUser = await Users.findOne({ username: username });
        if (!existingUser) return res.status(401).send("Username does not exist");

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) return res.status(401).send("Invalid Password");

        //Return JWT Token
        const jwtToken = jwt.sign(
            {
                id: existingUser._id,
                username: existingUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        return res.status(200).json({ jwtToken });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
};

const verifyLoggedIn = async (req, res) => {
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

module.exports = {
    handleLogin,
    verifyLoggedIn
};

