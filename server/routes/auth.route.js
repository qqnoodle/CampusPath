const express = require("express");
const { handleLogin, handleSignUp, resetPassword, verifyToken } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", handleLogin);
router.post("/signUp", handleSignUp);
router.post("/verifyToken", verifyToken);
//router.post("/resetPassword", resetPassword);
module.exports = router;
