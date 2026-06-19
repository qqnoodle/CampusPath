const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../models/users.model.js");

const SALT = 12;


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

const createUser = async (req, res) => {
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
        await Users.create({
            username: username,
            email: email,
            password: encryptedPassword
        });

        res.status(201).send("Your account has been created");

    } catch (error) {
        console.log(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
};

module.exports = {
    createUser
};

