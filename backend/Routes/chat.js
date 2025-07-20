const express = require('express');
const { getresponse } = require('../Controllers/chatcontroller');
const router = express.Router();


router.post('/chatwith', getresponse);

module.exports = router;