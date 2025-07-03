const express = require('express');
const {adminsignup, adminlogin,adminlogout} = require('../Controllers/admincontroller')
const {adminmiddle} = require('../middlewars.js/adminmid');
const router = express.Router();


router.post('/signup',adminsignup);
router.post('/login',adminlogin);
router.post('/logout',adminlogout);


module.exports = router;