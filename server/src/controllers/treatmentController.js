const Treatment = require("../models/Treatment");

// Create a treatment
const createTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Treatment created successfully",
      data: treatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create treatment",
      error: error.message,
    });
  }
};

// Get all active treatments
const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({ isActive: true })
      .populate("hospital", "name city address");

    res.status(200).json({
      success: true,
      count: treatments.length,
      data: treatments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatments",
      error: error.message,
    });
  }
};

// Get treatment by ID
const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate("hospital", "name city address");

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: treatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch treatment",
      error: error.message,
    });
  }
};

// Update treatment
const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdated: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("hospital", "name city address");

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Treatment updated successfully",
      data: treatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update treatment",
      error: error.message,
    });
  }
};

// Soft delete treatment
const deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Treatment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete treatment",
      error: error.message,
    });
  }
};

// Compare treatment prices
const compareTreatmentPrices = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Treatment name is required",
      });
    }

    const treatments = await Treatment.find({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    })
      .populate("hospital", "name city address location rating")
      .sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: treatments.length,
      treatment: name,
      data: treatments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to compare treatment prices",
      error: error.message,
    });
  }
};

module.exports = {
  createTreatment,
  getTreatments,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
  compareTreatmentPrices,
};
