require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

const locationRoute = require("./routes/location.route.js");
const pathRoute = require("./routes/path.route");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

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
//debug
app.get("/debug", (req, res) => {
    const routes = [];
    app._router.stack.forEach(r => {
        if (r.route) {
            routes.push(r.route.path);
        } else if (r.name === 'router') {
            r.handle.stack.forEach(layer => {
                if (layer.route) routes.push(layer.route.path);
            });
        }
    });
    res.json(routes);
});

//routes
app.use("/api/locations", locationRoute);
app.use("/api/path", pathRoute);


//Database connection test
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

module.exports = app;
