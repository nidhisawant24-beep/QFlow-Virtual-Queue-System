const express = require('express');
const router = express.Router();
const {
  getAllBusinesses,
  getBusinessById,
  uploadBusinessLogo,
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public browsing routes
router.get('/', getAllBusinesses);
router.get('/:id', getBusinessById);

// Business authenticated routes
router.post(
  '/logo',
  protect,
  authorize('business'),
  upload.single('logo'),
  uploadBusinessLogo
);

module.exports = router;
