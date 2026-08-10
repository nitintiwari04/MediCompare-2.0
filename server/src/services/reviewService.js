const Review = require("../models/Review");
const Hospital = require("../models/Hospital");

const updateHospitalRating = async (hospitalId) => {
  const result = await Review.aggregate([
    {
      $match: {
        hospital: hospitalId,
      },
    },
    {
      $group: {
        _id: "$hospital",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    await Hospital.findByIdAndUpdate(hospitalId, {
      rating: 0,
      reviewCount: 0,
    });

    return;
  }

  const { averageRating, reviewCount } = result[0];

  await Hospital.findByIdAndUpdate(hospitalId, {
    rating: Number(averageRating.toFixed(1)),
    reviewCount,
  });
};

module.exports = {
  updateHospitalRating,
};