const express = require("express");
const router = express.Router();
const { getAllLocation, getLocation } = require("../controllers/location.controller.js");

router.get("/", getAllLocation);
router.get("/:location", getLocation);
module.exports = router;
