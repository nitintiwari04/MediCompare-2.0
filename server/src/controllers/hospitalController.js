const Hospital = require("../models/Hospital");

// Create hospital
const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hospital",
      error: error.message,
    });
  }
};

// Get all hospitals
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals",
      error: error.message,
    });
  }
};

// Get hospital by ID
const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospital",
      error: error.message,
    });
  }
};

module.exports = {
  createHospital,
  getHospitals,
  getHospitalById,
};