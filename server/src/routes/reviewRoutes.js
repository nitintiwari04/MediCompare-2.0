const express = require("express");

const {
    getHospitalReviews,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/hospital/:hospitalId", getHospitalReviews);

// Protected
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;