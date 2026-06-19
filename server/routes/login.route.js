
const express = require("express");
const { handleLogin, verifyLoggedIn } = require("../controllers/login.controller");
const router = express.Router();

router.post("/", handleLogin);
router.post("/verify", verifyLoggedIn);
module.exports = router;
