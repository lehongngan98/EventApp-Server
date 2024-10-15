const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});
    const data = [];
    users.forEach(user => {
        data.push({
            id: user._id,
            fullname: user.fullname,
            email: user.email,           
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role
        });
    });    
    res.status(200).json({
        message: 'Get users successfully',
        success: true,
        data
    });
    
});

module.exports = {
    getAllUsers,
    
}