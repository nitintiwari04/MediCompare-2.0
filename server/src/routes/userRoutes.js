const express = require("express");

const {getProfile, saveHospital, removeSavedHospital, getSavedHospitals} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.post("/saved/:hospitalId", protect, saveHospital);

router.delete("/saved/:hospitalId", protect, removeSavedHospital);
router.get("/saved", protect, getSavedHospitals);

module.exports = router;