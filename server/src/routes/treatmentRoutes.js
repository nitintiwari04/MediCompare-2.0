const express = require("express");

const {
  createTreatment,
  getTreatments,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
  compareTreatmentPrices,
} = require("../controllers/treatmentController");

const router = express.Router();

router.get("/compare", compareTreatmentPrices);

router.post("/", createTreatment);
router.get("/", getTreatments);
router.get("/:id", getTreatmentById);
router.put("/:id", updateTreatment);
router.delete("/:id", deleteTreatment);

module.exports = router;