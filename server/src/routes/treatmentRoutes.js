const express = require("express");

const {
  createTreatment,
  getTreatments,
  getTreatmentById,
  compareTreatmentPrices,
} = require("../controllers/treatmentController");

const router = express.Router();

router.get("/compare", compareTreatmentPrices);

router.post("/", createTreatment);
router.get("/", getTreatments);
router.get("/:id", getTreatmentById);

module.exports = router;