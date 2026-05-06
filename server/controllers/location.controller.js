const express = require("express");
const Location = require("../models/locations.model.js");

const getAllLocation = async (req, res) => {
    try {
        const loc = await Location.find({});
        res.status(200).json(loc);
    } catch {
        res.status(500).send('Something unexpected went wrong');
    }
};


const getLocation = async (req, res) => {
    try {
        const locationName = req.body.locationName;
        const locationData = await Location.findById(locationName);
        res.status(200).json(locationData);
    } catch {
        res.status(500).send('Something unexpected went wrong');
    }
}

module.exports = {
    getAllLocation,
    getLocation,
};

