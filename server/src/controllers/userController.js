const User = require("../models/User");

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
 
module.exports = {
    getProfile,
    saveHospital,
    removeSavedHospital,
    getSavedHospitals
};