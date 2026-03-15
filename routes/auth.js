var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, ChangePasswordValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')
//login
router.post('/login',async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username,password);
    if(!result){
        res.status(404).send("thong tin dang nhap khong dung")
    }else{
        res.send(result)
    }
    
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b667447a753f5a608e2f59'
    )
    res.send(newUser)
})
router.get('/me',CheckLogin,function(req,res,next){
    // Return only specific fields
    let userInfo = {};
    if (Array.isArray(req.user) && req.user.length > 0) {
        userInfo = {
            _id: req.user[0]._id,
            username: req.user[0].username,
            email: req.user[0].email,
            fullName: req.user[0].fullName
        };
    }
    res.send(userInfo)
})

// Change password endpoint
router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    let { oldPassword, newPassword } = req.body;
    
    // Get user ID from the auth middleware
    let userId = req.user[0]._id;
    
    let result = await userController.ChangePassword(userId, oldPassword, newPassword);
    
    if (result.success) {
        res.status(200).send({ message: result.message });
    } else {
        res.status(400).send({ message: result.message });
    }
})

//register
//changepassword
//me
//forgotpassword
//permission
module.exports = router;