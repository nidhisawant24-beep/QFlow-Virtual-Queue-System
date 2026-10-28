const express = require('express');
const router = express.Router();
const {
  createQueue,
  getMyQueues,
  getQueueById,
  updateQueueStatus,
  updateQueue,
} = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/auth');

// Business routes
router.post('/', protect, authorize('business'), createQueue);
router.get('/my-queues', protect, authorize('business'), getMyQueues);
router.patch('/:id/status', protect, authorize('business'), updateQueueStatus);
router.put('/:id', protect, authorize('business'), updateQueue);

// Public / customer routes
router.get('/:id', getQueueById);

module.exports = router;
