require("dotenv").config();
const express = require("express");
const Histories = require("../models/histories.model.js");
const jwt = require("jsonwebtoken");

const getHistories = async (req, res) => {
    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const username = payload.username;

        const userHistories = await Histories.find(
            {
                username: username
            }
        ).select("-username"); //Select is a mongoose function that helps us remove username from all the objects without manually filtering
        res.status(200).json(userHistories);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}

const addHistory = async (req, res) => {

    //The number of history entry each user is allocated
    const HISTORY_LIMIT = 20;

    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const username = payload.username;

        /*
         * I personally dont like the fact that addHistory should handle the limit of 20.
         * But I have no choice since I do not like frontend client side checking and i dont wish to use another API call
         */
        const userHistoryCount = await Histories.countDocuments(
            {
                username: username
            }
        );

        if (userHistoryCount === HISTORY_LIMIT) {
            //Steps find the Oldest, non favourited
            const oldestEntry = await Histories.findOne(
                {
                    username: username,
                    favourite: false,
                }
            ).sort({ timestamp: 1 });
            //Fail safe for when every entry is favorited
            if (!oldestEntry) return res.status(400).json({ success: false, message: "You cannot keep adding" });
            await Histories.deleteOne(
                {
                    username: username,
                    id: oldestEntry.id
                }
            );
        }
        await Histories.create({
            username: username,
            ...req.body
        });
        res.status(200).json({ success: true, message: "History Entry added" });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}

const toggleFavouriteHistory = async (req, res) => {
    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const username = payload.username;

        const { id } = req.body;
        const existingHistoryEntry = await Histories.findOne(
            {
                username: username,
                id: id
            }
        );
        if (!existingHistoryEntry) return res.status(400).json({ success: false, message: "entry does not exist!" });
        existingHistoryEntry.favourite = !existingHistoryEntry.favourite;
        await existingHistoryEntry.save();
        res.status(200).json({ success: true, message: "entry favorited" });
    } catch (error) {
        console.error(error);
        res.status(500).send(`something unexpected went wrong\n ${error.message}`);
    }
};

const updateHistory = async (req, res) => {
    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const username = payload.username;

        const { id, time } = req.body;
        const existingHistoryEntry = await Histories.findOne(
            {
                username: username,
                id: id
            }
        );
        if (!existingHistoryEntry) return res.status(400).json({ success: false, message: "entry does not exist!" });

        existingHistoryEntry.timestamp = time;
        await existingHistoryEntry.save();
        res.status(201).json({ success: true, message: "entry updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send(`something unexpected went wrong\n ${error.message}`);
    }
}


const deleteHistories = async (req, res) => {
    try {
        const header = req.headers.authorization;
        const jwtToken = header?.split(" ")[1];
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        await Histories.deleteMany(
            {
                username: payload.username
            }
        );
        res.status(200).json({ success: true, message: "History cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}


module.exports = {
    getHistories,
    addHistory,
    toggleFavouriteHistory,
    deleteHistories,
    updateHistory
};

