const express = require('express');
const router = express.Router();
const diagnoseController = require('../controllers/diagnoseController');

router.post('/', diagnoseController.diagnose);

module.exports = router;
