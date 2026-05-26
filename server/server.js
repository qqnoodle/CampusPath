require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

const locationRoute = require("./routes/location.route.js");
const pathRoute = require("./routes/path.route");

app.use(cors({
    origin: "*", // allow everything
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Connection test
app.get("/", (req, res) => {
    try {
        res.send("API is running...");
    } catch {
        res.send("API failure");
    }
});

//routes
app.use("/api/locations", locationRoute);
app.use("/api/path", pathRoute);


//Database connection test
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

module.exports = app;
