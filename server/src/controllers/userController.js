const User = require("../models/User");
const Review = require("../models/Review");

const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password")
            .populate("savedHospitals");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const reviews = await Review.find({
            user: req.user.userId
        })
            .populate("hospital", "name city address rating")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            dashboard: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },

                stats: {
                    savedHospitals: user.savedHospitals.length,
                    reviews: reviews.length
                },

                savedHospitals: user.savedHospitals,
                reviews
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const saveHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.savedHospitals.includes(hospitalId)) {
            return res.status(400).json({
                success: false,
                message: "Hospital already saved"
            });
        }

        user.savedHospitals.push(hospitalId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Hospital saved successfully"
        });

    } catch (error) {
        console.error("Save hospital error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const removeSavedHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.savedHospitals = user.savedHospitals.filter(
            id => id.toString() !== hospitalId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Hospital removed from saved list"
        });

    } catch (error) {
        console.error("Remove hospital error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

  const getSavedHospitals = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate("savedHospitals");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            hospitals: user.savedHospitals
        });

    } catch (error) {
        console.error("Get saved hospitals error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.user.userId
        })
            .populate("hospital", "name city address rating")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get my reviews error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch your reviews"
        });
    }
};
 
module.exports = {
    getProfile,
    saveHospital,
    removeSavedHospital,
    getSavedHospitals,
    getMyReviews,
    getDashboard
};