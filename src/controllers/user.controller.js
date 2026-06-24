import { savePersonalDetails, saveProfessionalDetails, saveCareerSummary } from "../services/user.service.js";
import jwt from "jsonwebtoken";

export const updatePersonalDetails = async (req, res) => {
    try {
        const email = req.body.email;
        delete req.body.email

        const personalDetails = req.body;
        const updatedUser = await savePersonalDetails(email, personalDetails);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Email not registered"
            });
        }

        //Access Token Generation:
        const accessToken = jwt.sign({ id: updatedUser._id, email: updatedUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

        //Refresh Token:
        const refreshToken = jwt.sign({ id: updatedUser._id, type: "refresh" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.status(200).json({
            success: true,
            messsage: "Personal details updated successfully",
            accessToken: accessToken
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
    try{
        const userId = req.user.id;
        const professionalDetails = req.body;

        const updatedUser = await saveProfessionalDetails(userId, professionalDetails);

        if(!updatedUser){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            mesasge : "Professional details updated successfully"
        })
    }
    catch(error){
        console.log("Error occured while adding professional details: ", error);
        return res.status(500).json({
            success: false,
            message : "Internal server error"
        })
    }
}

export const updateCareerSummary = async (req, res) => {
    try{
        const userId = req.user.id;
        const careerSummary = req.body;

        const updatedUser = await saveCareerSummary(userId, careerSummary);
        
        if(!updatedUser){
            return req.status(404).json({
                success : false,
                messasge :  "User not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Career summary updated successfully"
        })

    }
    catch(error){
        console.log("Error occured while updating career summary: " , error);
        return res.status(500).json({
            success: false,
            message : "Internal Server Error"
        });
    }
}