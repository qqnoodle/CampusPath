const expres = require("express");
const Location = require("../models/locations.model.js");
const Nodes = require("../models/nodes.model.js");

const findPath = async (req, res) => {
    optimisationMap = {
        0: "Shortest",
        1: "Sheltered",
        2: "Accessible"
    };
    try {
        const { startLocation, endLocation, optimisation } = await req.body;

        //TODO Convert information into graphs
        //TODO Run the algorithm
        //TODO Configure the output to fit the needs of frontend
        //TODO Handle the history
    } catch (error) {
        res.status(500).send(error.message);
    }
};
module.exports = { findPath };
