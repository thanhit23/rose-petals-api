const express = require('express');
const { analyticController } = require('../../controllers/admin');

const router = express.Router();

router.route('/').get(analyticController.getAnalytics);

module.exports = router;
