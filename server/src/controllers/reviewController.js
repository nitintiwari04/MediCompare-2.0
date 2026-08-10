const Review = require("../models/Review");
const Hospital = require("../models/Hospital");

const {
  updateHospitalRating,
} = require("../services/reviewService");

// Create review
const createReview = async (req, res) => {
  try {
    const { hospital, rating, comment } = req.body;

    if (!hospital || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Hospital, rating and comment are required",
      });
    }

    const hospitalExists = await Hospital.findById(hospital);

    if (!hospitalExists) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.userId,
      hospital,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this hospital",
      });
    }

    const review = await Review.create({
      user: req.user.userId,
      hospital,
      rating,
      comment,
    });

    await updateHospitalRating(hospital);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("hospital", "name city");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get reviews for a hospital
const getHospitalReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      hospital: req.params.hospitalId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Update own review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    await updateHospitalRating(review.hospital);

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("hospital", "name city");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete own review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
  _id: req.params.id,
  user: req.user.userId,
});

if (!review) {
  return res.status(404).json({
    success: false,
    message: "Review not found",
  });
}

const hospitalId = review.hospital;

await Review.findByIdAndDelete(review._id);

await updateHospitalRating(hospitalId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getHospitalReviews,
  updateReview,
  deleteReview,
};