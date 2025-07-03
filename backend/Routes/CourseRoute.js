const express = require('express');
const router = express.Router();
const { creatingcourse, updatingcourse, deletingcourse,
    gettingcourse,
    getcoursedetails, 
    buycourse} = require('../Controllers/CourseController');
const checkusertoken = require('../middlewars.js/userm');

const {adminmiddle} = require('../middlewars.js/adminmid');


router.post('/createcourse',adminmiddle, creatingcourse);
router.put('/updatecourse/:id',adminmiddle, updatingcourse)
router.delete('/deletecourse/:id',adminmiddle, deletingcourse);
router.get('/readcourse', gettingcourse);
router.get('/coursedetails/:id', getcoursedetails);
router.post('/buy/:courseid',checkusertoken,buycourse);




module.exports = router;