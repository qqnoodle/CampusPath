const express = require("express");
const { findPath } = require("../controllers/path.controller");
const router = express.Router();

router.post("/find", findPath);
module.exports = router;
