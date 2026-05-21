require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const locationRoute = require("./routes/location.route.js");
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;
<<<<<<< Updated upstream
const routeRoute = require("./routes/route.route");
=======
const pathRoute = require("./routes/path.route");
>>>>>>> Stashed changes

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/route", routeRoute);

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
<<<<<<< Updated upstream
=======
app.use("/api/path", pathRoute);
>>>>>>> Stashed changes

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


//Database connection test
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


module.exports = app;
