const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, optionalToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', reportController.getAll);
router.get('/my', optionalToken, reportController.getMyReports);
router.get('/:id', reportController.getById);
router.post('/', optionalToken, upload.single('photo'), reportController.create);
router.get('/:id/timeline', reportController.getTimeline);
router.patch('/:id/status', verifyToken, requireRole('ADMIN'), reportController.updateStatus);

module.exports = router;
