const express = require("express");
const Location = require("../models/locations.model.js");

const getAllLocation = async (req, res) => {
    try {
        const loc = await Location.find({});
        res.status(200).json(loc);
    } catch {
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
};


const getLocation = async (req, res) => {
    try {
        const query = req.query.q ? req.query.q : "";
        const locationData = await Location.find({
            //Basic filter needs upgrades
            $or: [
                { name: { $regex: `.*${query}.*`, $options: "i" } },
                { roomNumber: { $regex: `.*${query}.*`, $options: "i" } },
                { building: { $regex: `.*${query}.*`, $options: "i" } },
            ]
        });
        res.status(200).json(locationData);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Something unexpected went wrong\n ${error.message}`);
    }
}

module.exports = {
    getAllLocation,
    getLocation,
};

