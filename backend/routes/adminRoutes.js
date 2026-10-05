const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All admin routes require valid JWT token and ADMIN role
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/reports', adminController.getReports);
router.patch('/reports/:id/verify', adminController.verifyReport);
router.patch('/reports/:id/reject', adminController.rejectReport);
router.patch('/reports/:id/in-progress', adminController.markInProgress);
router.patch('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
