const express = require("express");
const {
    handleLogin,
    handleSignUp,
    verifyToken,
    refreshOTP,
    verifyOTP,
    resetPassword,
    forgotPassword
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", handleLogin);
router.post("/signUp", handleSignUp);
router.post("/verifyToken", verifyToken);
router.post("/otp/refresh", refreshOTP);
router.post("/otp/verify", verifyOTP);
router.post("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);
module.exports = router;
