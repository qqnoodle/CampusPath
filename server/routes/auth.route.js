const express = require("express");
const {
    handleLogin,
    handleSignUp,
    resetPassword,
    verifyToken,
    refreshOTP,
    verifyOTP
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", handleLogin);
router.post("/signUp", handleSignUp);
router.post("/verifyToken", verifyToken);
router.post("/otp/refresh", refreshOTP);
router.post("/otp/verify", verifyOTP);
//router.post("/resetPassword", resetPassword);
module.exports = router;
