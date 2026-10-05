const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/summary', analyticsController.getSummary);
router.get('/categories', analyticsController.getCategoryStats);
router.get('/status', analyticsController.getStatusStats);
router.get('/timeseries', analyticsController.getTimeSeries);
router.get('/wards', analyticsController.getWardStats);

module.exports = router;
