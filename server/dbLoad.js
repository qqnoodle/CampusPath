require("dotenv").config();
const mongoose = require("mongoose");
const Locations = require("./models/locations.model.js");
const Nodes = require("./models/nodes.model.js");

const fs = require("node:fs");

const PORT = process.env.PORT ? process.env.PORT : 5000;
const MONGO_URI = process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI_PROD;


const directory = "../Map"
const buildingFolders = fs.readdirSync(directory, { withFileTypes: true });


const buildDB = async (directory, Folders) => {

    await mongoose.connect(MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.log(err));

    try {
        for (const entry of Folders) {
            const path = `${directory}/${entry.name}`;

            const locationsFilePath = `${path}/locations.js`;
            const nodesFilePath = `${path}/nodes.js`;


            const locationsText = fs.readFileSync(locationsFilePath, "utf-8");
            const nodesText = fs.readFileSync(nodesFilePath, "utf-8");

            const locationJson = JSON.parse(locationsText);
            const nodesJson = JSON.parse(nodesText);

            await Locations.insertMany(locationJson);
            await Nodes.insertMany(nodesJson);
            console.log(path + " Added");
        }
    } catch (err) {
        console.log(err);
    } finally {
        await mongoose.disconnect()
    }

};

buildDB(directory, buildingFolders);
