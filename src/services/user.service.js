import userModel from "../models/user.model.js"

export const savePersonalDetails = async (userId, personalDetails) => {
    const updatedUser = await userModel.findByIdAndUpdate(userId, {personal_details : personalDetails}, {new : true});
    return updatedUser;
}

export const saveProfessionalDetails = async (req,res) => {

}

export const saveCareerSummary = async (req,res) => {
    
}