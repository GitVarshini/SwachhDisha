const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/reports', mapController.getReports);
router.get('/hotspots', mapController.getHotspots);

module.exports = router;
