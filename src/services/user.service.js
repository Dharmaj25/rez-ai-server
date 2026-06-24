import userModel from "../models/user.model.js"

export const savePersonalDetails = async (email, personal_details) => {
    const updatePayload = {
        $set: {
            "accountSetupStep": "COMPLETED",
            "onboarding.personalCompleted": true
        }
    };

    const { first_name, last_name, country, state, city, country_code, number } = personal_details;

    if (first_name !== undefined) updatePayload.$set["personalDetails.first_name"] = first_name;
    if (last_name !== undefined) updatePayload.$set["personalDetails.last_name"] = last_name;
    if (country !== undefined) updatePayload.$set["personalDetails.country"] = country;
    if (state !== undefined) updatePayload.$set["personalDetails.state"] = state;
    if (city !== undefined) updatePayload.$set["personalDetails.city"] = city;

    if (country_code !== undefined) updatePayload.$set["personalDetails.phone.country_code"] = country_code;
    if (number !== undefined) updatePayload.$set["personalDetails.phone.number"] = number;

    const updatedUser = await userModel.findOneAndUpdate({ email }, updatePayload, { new: true });
    return updatedUser;
};

export const saveProfessionalDetails = async (userId, professionalDetails) => {

    let updatePayload = {
        $set: {
            "onboarding.professionalCompleted": true
        }
    }

    const { career_level, industry, skills, total_experience, current_role, highest_education, graduation_year, linkedin_profile, portfolio } = professionalDetails;

    if (career_level !== undefined) updatePayload.$set["professionalDetails.career_level"] = career_level;
    if (industry !== undefined) updatePayload.$set["professionalDetails.industry"] = industry;
    if (skills !== undefined) updatePayload.$set["professionalDetails.skills"] = skills;
    if (total_experience !== undefined) updatePayload.$set["professionalDetails.total_experience"] = total_experience;
    if (current_role !== undefined) updatePayload.$set["professionalDetails.current_role"] = current_role;
    if (highest_education !== undefined) updatePayload.$set["professionalDetails.highest_eductaion"] = highest_education;
    if (graduation_year !== undefined) updatePayload.$set["professionalDetails.graduation_year"] = graduation_year;
    if (linkedin_profile !== undefined) updatePayload.$set["professionalDetails.linkedin_profile"] = linkedin_profile;
    if (portfolio !== undefined) updatePayload.$set["professionalDetails.portfolio"] = portfolio;

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatePayload, { new: true });
    return updatedUser;
}

export const saveCareerSummary = async (userId, career_target) => {
    let updatePayload = {
        $set: {
            "onboarding.careerCompleted" : true
        }
    }
    
    const {target_role, pitch} = career_target; 
    
    if(target_role !== undefined) updatePayload.$set["careerTarget.target_role"] = target_role;
    if(pitch !== undefined) updatePayload.$set["careerTarget.pitch"] = pitch;

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatePayload, { new: true });
    return updatedUser;
}