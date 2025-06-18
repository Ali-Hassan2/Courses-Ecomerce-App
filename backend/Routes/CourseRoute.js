const express = require('express');
const router = express.Router();
const { creatingcourse, updatingcourse, deletingcourse,
    gettingcourse,
    getcoursedetails, 
    buycourse} = require('../Controllers/CourseController');
const checkusertoken = require('../middlewars.js/userm');

router.post('/createcourse', creatingcourse);
router.put('/updatecourse/:id', updatingcourse)
router.delete('/deletecourse/:id', deletingcourse);
router.get('/readcourse', gettingcourse);
router.get('/coursedetails/:id', getcoursedetails);
router.post('/buy/:courseid',checkusertoken,buycourse);




module.exports = router;