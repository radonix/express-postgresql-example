import User from "../models/User.js";

const updateUserProfile = async (userId, updateData) => {
    console.log(`Updating profile for user ID: ${userId} in service`, updateData);

    // Basic validation for update data (you might want more specific validation)
    if (!updateData || Object.keys(updateData).length === 0) {
        throw { status: 400, message: "No update data provided" };
    }

    // Prevent updating sensitive fields directly through this endpoint
    const disallowedUpdates = ['email', 'password'];
    disallowedUpdates.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
            throw { status: 400, message: `Cannot update '${field}' through this profile update endpoint` };
        }
    });

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });

        if (!updatedUser) {
            throw { status: 404, message: `User with ID ${userId} not found` };
        }

        console.log("Updated user profile in service:", updatedUser);
        return { message: "Profile updated successfully", user: updatedUser };

    } catch (error) {
        console.error("Error updating user profile in service:", error);
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const errors = Object.values(error.errors).map(el => el.message);
            throw { status: 400, message: `Validation error: ${errors.join(', ')}` };
        }
        if (error.status) {
            throw error;
        }
        throw { status: 500, message: "Error updating user profile" };
    }
};

const getUserProfile = async (userId) => {
    console.log(`Fetching profile for user ID: ${userId} in service`);
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from the fetched profile
        if (!user) {
            throw { status: 404, message: `User with ID ${userId} not found` };
        }
        console.log("Fetched user profile in service:", user);
        return { user };
    } catch (error) {
        console.error("Error fetching user profile in service:", error);
        if (error.status) {
            throw error;
        }
        throw { status: 500, message: "Error fetching user profile" };
    }
};

export default { updateUserProfile, getUserProfile };