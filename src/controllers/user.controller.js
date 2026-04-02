import { savePersonalDetails } from "../services/user.service.js";

export const updatePersonalDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const personalDetails = req.body;

        const updatedUser = await savePersonalDetails(userId, personalDetails);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            messsage: "Personal details updated successfully",
        });
    }
    catch (error) {
        console.log("Error occured while updating user details : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateProfessionalDetails = async (req, res) => {

}

export const updateCareerSummary = async (req, res) => {

}