let userModel = require("../schemas/users");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let { privateKey } = require('../config/keys')

module.exports = {
    CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        return await userModel
            .find({ isDeleted: false })
    },
    GetUserById: async function (id) {
        try {
            return await userModel
                .find({
                    isDeleted: false,
                    _id: id
                })
        } catch (error) {
            return false;
        }
    },
    QueryLogin: async function (username, password) {
        if (!username || !password) {
            return false;
        }
        let user = await userModel.findOne({
            username: username,
            isDeleted: false
        })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                return jwt.sign({
                    id: user.id
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '1d'
                })
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        try {
            let user = await userModel.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            
            // Verify old password
            if (!bcrypt.compareSync(oldPassword, user.password)) {
                return { success: false, message: 'Old password is incorrect' };
            }
            
            // Hash new password
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            
            // Update password
            await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
            
            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message: 'Error changing password' };
        }
    }
}