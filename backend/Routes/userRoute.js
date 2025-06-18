const express = require('express');
const { signup,login,logout,purchasedcourses } = require('../Controllers/user.controller');
const checkusertoken = require('../middlewars.js/userm');
const router = express.Router();



router.post('/signup',signup);
router.post('/login',login)
router.get('/logout',logout)
router.get('/purchased',checkusertoken,purchasedcourses)

module.exports = router