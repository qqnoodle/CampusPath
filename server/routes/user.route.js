
const express = require("express");
const {
    getHistories,
    addHistory,
    toggleFavouriteHistory,
    deleteHistories,
    updateHistory
} = require("../controllers/histories.controller");
const router = express.Router();

router.get("/history", getHistories);
router.post("/history", addHistory);
router.post("/history", updateHistory);
router.delete("/history", deleteHistories);

router.post("/history/favourite", toggleFavouriteHistory);
module.exports = router;
