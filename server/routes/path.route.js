const express = require("express");
const { findPath } = require("../controllers/path.controller");
const router = express.Router();

router.get("/", findPath);
module.exports = router;
