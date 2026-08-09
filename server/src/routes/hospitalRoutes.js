const express = require("express");

const {
  createHospital,
  getHospitals,
  getHospitalById,
} = require("../controllers/hospitalController");

const router = express.Router();

router.post("/", createHospital);
router.get("/", getHospitals);
router.get("/:id", getHospitalById);

module.exports = router;