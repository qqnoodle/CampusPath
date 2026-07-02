require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 5000;

const locationRoute = require("./routes/location.route.js");
const pathRoute = require("./routes/path.route");
const authRoute = require("./routes/auth.route");

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
app.use("/api/auth", authRoute);


//Database connection test
const MONGO_URI = process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI_PROD;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


// added listen
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

module.exports = app;

